import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, dbEspecieToApp } from '../lib/supabase';
import { especies as mockEspecies } from '../data/especies';

interface UseEspeciesOptions {
  biomas?: string[];
  tamanhos?: string[];
  dificuldades?: string[];
  conservacao?: string[];
  query?: string;
}

export function useEspecies(options: UseEspeciesOptions = {}) {
  const [especies, setEspecies] = useState(mockEspecies);
  const [totalCatalogadas, setTotalCatalogadas] = useState(mockEspecies.length);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Serializar opções para evitar re-renders desnecessários
  const biomasKey = JSON.stringify(options.biomas || []);
  const tamanhosKey = JSON.stringify(options.tamanhos || []);
  const dificuldadesKey = JSON.stringify(options.dificuldades || []);
  const conservacaoKey = JSON.stringify(options.conservacao || []);
  const queryKey = options.query || '';

  useEffect(() => {
    let cancelled = false;

    const fetchEspecies = async () => {
      setIsLoading(true);
      setError(null);

      const biomas = options.biomas;
      const tamanhos = options.tamanhos;
      const dificuldades = options.dificuldades;
      const conservacao = options.conservacao;
      const query = options.query;

      // Modo offline - usar dados mockados
      if (!isSupabaseConfigured()) {
        let filtered = [...mockEspecies];

        if (biomas?.length) {
          filtered = filtered.filter(e => e.biomas.some(b => biomas.includes(b)));
        }
        if (tamanhos?.length) {
          filtered = filtered.filter(e => tamanhos.includes(e.tamanho));
        }
        if (dificuldades?.length) {
          filtered = filtered.filter(e => dificuldades.includes(e.manejo.dificuldade));
        }
        if (conservacao?.length) {
          filtered = filtered.filter(e => conservacao.includes(e.conservacao.status));
        }
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(e =>
            e.nomeCientifico.toLowerCase().includes(q) ||
            e.nomesPopulares.some(n => n.toLowerCase().includes(q))
          );
        }

        if (!cancelled) {
          setEspecies(filtered);
          setTotalCatalogadas(mockEspecies.length);
          setIsLoading(false);
        }
        return;
      }

      try {
        let q = supabase.from('especies').select('*');

        if (biomas?.length) {
          q = q.overlaps('biomas', biomas);
        }
        if (tamanhos?.length) {
          q = q.in('tamanho', tamanhos);
        }
        if (dificuldades?.length) {
          q = q.in('manejo_dificuldade', dificuldades);
        }
        if (conservacao?.length) {
          q = q.in('conservacao_status', conservacao);
        }
        if (query) {
          const searchTerm = query.toLowerCase();
          q = q.or(`nome_cientifico.ilike.%${searchTerm}%,nomes_populares.cs.{${searchTerm}}`);
        }

        const { data, error: queryError } = await q.order('nome_cientifico');

        if (queryError) throw queryError;
        if (!cancelled) {
          const mapped = (data || []).map(dbEspecieToApp);
          setEspecies(mapped);
          // Só atualizar o total se não tem filtro (primeiro fetch)
          const hasFilters = biomas?.length || tamanhos?.length || dificuldades?.length || conservacao?.length || query;
          if (!hasFilters) {
            setTotalCatalogadas(mapped.length);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          console.error('Erro ao buscar espécies:', err);
          setEspecies(mockEspecies);
          setTotalCatalogadas(mockEspecies.length);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchEspecies();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biomasKey, tamanhosKey, dificuldadesKey, conservacaoKey, queryKey]);

  return { especies, totalCatalogadas, isLoading, error };
}

export function useEspecie(especieId: string | null) {
  const [especie, setEspecie] = useState<typeof mockEspecies[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!especieId) {
      setEspecie(null);
      setIsLoading(false);
      return;
    }

    const fetchEspecie = async () => {
      setIsLoading(true);
      setError(null);

      // Modo offline - buscar nos dados mockados
      if (!isSupabaseConfigured()) {
        const mockEspecie = mockEspecies.find(e => e.id === especieId);
        setEspecie(mockEspecie || null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await supabase
          .from('especies')
          .select('*')
          .eq('slug', especieId)
          .single();

        if (queryError) throw queryError;
        setEspecie(dbEspecieToApp(data));
      } catch (err) {
        setError(err as Error);
        console.error('Erro ao buscar espécie:', err);
        // Fallback para dados mockados
        const mockEspecie = mockEspecies.find(e => e.id === especieId);
        setEspecie(mockEspecie || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEspecie();
  }, [especieId]);

  return { especie, isLoading, error };
}

// Busca de espécies por nome (para autocomplete)
export function useBuscarEspecies() {
  const [resultados, setResultados] = useState<typeof mockEspecies>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buscar = async (termo: string) => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }

    setIsLoading(true);

    // Modo offline - buscar nos dados mockados
    if (!isSupabaseConfigured()) {
      const q = termo.toLowerCase();
      const filtered = mockEspecies.filter(e =>
        e.nomeCientifico.toLowerCase().includes(q) ||
        e.nomesPopulares.some(n => n.toLowerCase().includes(q))
      );
      setResultados(filtered.slice(0, 10));
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('especies')
        .select('*')
        .or(`nome_cientifico.ilike.%${termo}%,nomes_populares.cs.{${termo.toLowerCase()}}`)
        .limit(10);

      if (error) throw error;
      setResultados((data || []).map(dbEspecieToApp));
    } catch (err) {
      console.error('Erro na busca:', err);
      // Fallback para dados mockados
      const q = termo.toLowerCase();
      const filtered = mockEspecies.filter(e =>
        e.nomeCientifico.toLowerCase().includes(q) ||
        e.nomesPopulares.some(n => n.toLowerCase().includes(q))
      );
      setResultados(filtered.slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  return { resultados, isLoading, buscar };
}
