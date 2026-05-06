import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { geocodeEndereco, getEstadoCoordenadas } from '../lib/geocoding';
import { criadores as mockCriadores, type CriadorData } from '../data/criadores';

interface UseCriadoresOptions {
  especies?: string[];
  estados?: string[];
  status?: ('venda' | 'troca' | 'informacao')[];
  lat?: number;
  lng?: number;
  raioKm?: number;
  query?: string;
}

export function useCriadores(options: UseCriadoresOptions = {}) {
  const [criadores, setCriadores] = useState<CriadorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCriadores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Filtra mock data localmente com todos os filtros
    const filterMockCriadores = () => {
      let filtered = [...mockCriadores];

      if (options.estados?.length) {
        filtered = filtered.filter(c => options.estados?.includes(c.estado));
      }

      if (options.status?.length) {
        filtered = filtered.filter(c => c.status.some(s => options.status?.includes(s)));
      }

      if (options.especies?.length) {
        filtered = filtered.filter(c =>
          c.especies.some((espId: string) => options.especies?.includes(espId))
        );
      }

      if (options.query) {
        const q = options.query.toLowerCase();
        filtered = filtered.filter(c =>
          c.nome.toLowerCase().includes(q) ||
          c.cidade.toLowerCase().includes(q)
        );
      }

      return filtered;
    };

    // Modo offline - usar dados mockados
    if (!isSupabaseConfigured()) {
      setCriadores(filterMockCriadores());
      setIsLoading(false);
      return;
    }

    try {
      // RPC que retorna criadores já com species_slugs agregados — 1 query só
      const rpcArgs: Record<string, any> = {};
      if (options.especies?.length) rpcArgs.p_especie_slugs = options.especies;
      if (options.estados?.length) rpcArgs.p_estado = options.estados[0];
      if (options.status?.length) rpcArgs.p_status = options.status;

      const { data, error: rpcError } = await supabase
        .rpc('listar_criadores_com_especies', rpcArgs);

      if (rpcError) throw rpcError;

      // Mapear resultado: especies_slugs → especies (compatível com CriadorData)
      const criadores = (data || []).map((row: any) => ({
        ...row,
        especies: row.especies_slugs || [],
      })) as unknown as CriadorData[];

      // Filtro extra por texto (não suportado na RPC)
      const resultado = options.query
        ? criadores.filter(c => {
            const q = options.query!.toLowerCase();
            return c.nome.toLowerCase().includes(q) || c.cidade.toLowerCase().includes(q);
          })
        : criadores;

      setCriadores(resultado);
    } catch (err) {
      console.error('Erro ao buscar criadores via RPC, usando dados locais:', err);
      setCriadores(filterMockCriadores());
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(options.especies),
    JSON.stringify(options.estados),
    JSON.stringify(options.status),
    options.query,
    options.lat,
    options.lng,
    options.raioKm,
  ]);

  useEffect(() => {
    fetchCriadores();
  }, [fetchCriadores]);

  return { criadores, isLoading, error, refetch: fetchCriadores };
}

export function useCriador(criadorId: string | null) {
  const [criador, setCriador] = useState<CriadorData | null>(null);
  const [especies, setEspecies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!criadorId) {
      setCriador(null);
      setEspecies([]);
      setIsLoading(false);
      return;
    }

    const fetchCriador = async () => {
      setIsLoading(true);
      setError(null);

      // Modo offline - buscar nos dados mockados
      if (!isSupabaseConfigured()) {
        const mockCriador = mockCriadores.find(c => c.id === criadorId);
        if (mockCriador) {
          setCriador(mockCriador);
          setEspecies([]);
        }
        setIsLoading(false);
        return;
      }

      try {
        // Buscar criador
        const { data: criadorData, error: criadorError } = await supabase
          .from('criadores')
          .select('*')
          .eq('id', criadorId)
          .single();

        if (criadorError) throw criadorError;
        setCriador(criadorData as unknown as CriadorData);

        // Buscar espécies do criador
        const { data: especiesData } = await supabase
          .from('criador_especies')
          .select('especie:especie_id(*)')
          .eq('criador_id', criadorId)
          .eq('disponivel', true);

        if (especiesData) {
          setEspecies(especiesData.map((ce: any) => ce.especie));
        }
      } catch (err) {
        setError(err as Error);
        console.error('Erro ao buscar criador:', err);
        // Fallback para dados mockados
        const mockCriador = mockCriadores.find(c => c.id === criadorId);
        if (mockCriador) {
          setCriador(mockCriador);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriador();
  }, [criadorId]);

  return { criador, especies, isLoading, error };
}

export function useUpdateCriador() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCriador = async (criadorId: string, updates: Partial<CriadorData>) => {
    setIsLoading(true);
    setError(null);

    // Modo offline - simular sucesso
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return { data: { ...updates, id: criadorId } as CriadorData, error: null };
    }

    try {
      // Re-geocodificar se cidade ou estado mudaram
      const locationChanged = updates.cidade || updates.estado || updates.cep || updates.endereco;
      if (locationChanged) {
        const geoResult = await geocodeEndereco({
          cidade: updates.cidade as string,
          estado: updates.estado as string,
          cep: updates.cep as string,
          endereco: updates.endereco as string,
        });

        if (geoResult) {
          updates.latitude = geoResult.latitude;
          updates.longitude = geoResult.longitude;
        } else if (updates.estado) {
          const estadoCoords = getEstadoCoordenadas(updates.estado as string);
          updates.latitude = estadoCoords.latitude;
          updates.longitude = estadoCoords.longitude;
        }
      }

      const { data, error: updateError } = await supabase
        .from('criadores')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', criadorId)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data: data as unknown as CriadorData, error: null };
    } catch (err) {
      setError(err as Error);
      return { data: null, error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCriador, isLoading, error };
}

export function useUploadAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    setIsLoading(true);
    setProgress(0);

    // Modo offline - retornar URL simulada
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return URL.createObjectURL(file);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('criadores')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('criadores')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadAvatar, isLoading, progress };
}
