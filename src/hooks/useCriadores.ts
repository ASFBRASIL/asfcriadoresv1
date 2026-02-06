import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

    // Modo offline - usar dados mockados
    if (!isSupabaseConfigured()) {
      let filtered = [...mockCriadores];

      // Aplicar filtros nos dados mockados
      if (options.estados?.length) {
        filtered = filtered.filter(c => options.estados?.includes(c.estado));
      }

      if (options.status?.length) {
        filtered = filtered.filter(c => c.status.some(s => options.status?.includes(s)));
      }

      if (options.query) {
        const q = options.query.toLowerCase();
        filtered = filtered.filter(c => 
          c.nome.toLowerCase().includes(q) || 
          c.cidade.toLowerCase().includes(q)
        );
      }

      setCriadores(filtered);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase.from('criadores').select('*');

      // Filtro por estado
      if (options.estados?.length) {
        query = query.in('estado', options.estados);
      }

      // Filtro por status
      if (options.status?.length) {
        query = query.overlaps('status', options.status);
      }

      // Busca por texto (nome, cidade)
      if (options.query) {
        query = query.or(`nome.ilike.%${options.query}%,cidade.ilike.%${options.query}%`);
      }

      // Filtro por espécies (requer join)
      if (options.especies?.length) {
        const { data: criadorEspecies } = await supabase
          .from('criador_especies')
          .select('criador_id')
          .in('especie_id', options.especies);

        if (criadorEspecies) {
          const criadorIds = [...new Set(criadorEspecies.map(ce => ce.criador_id))];
          query = query.in('id', criadorIds);
        }
      }

      const { data, error: queryError } = await query.order('avaliacao_media', { ascending: false });

      if (queryError) throw queryError;
      setCriadores((data || []) as CriadorData[]);
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar criadores:', err);
      // Fallback para dados mockados em caso de erro
      setCriadores(mockCriadores);
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
        setCriador(criadorData as CriadorData);

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
      const { data, error: updateError } = await supabase
        .from('criadores')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', criadorId)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data: data as CriadorData, error: null };
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
