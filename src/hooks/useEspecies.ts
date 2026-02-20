import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, dbEspecieToApp } from '../lib/supabase';
import { especies as mockEspecies } from '../data/especies';

// Remove acentos para busca tolerante
function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Verifica se um texto normalizado contém o termo normalizado
function matchesSearch(text: string, term: string): boolean {
  return normalize(text).includes(term);
}

interface UseEspeciesOptions {
  biomas?: string[];
  tamanhos?: string[];
  dificuldades?: string[];
  conservacao?: string[];
  producao?: string[];
  generos?: string[];
  query?: string;
  limit?: number;
  offset?: number;
}

export function useEspecies(options: UseEspeciesOptions = {}) {
  const [especies, setEspecies] = useState(mockEspecies);
  const [totalCatalogadas, setTotalCatalogadas] = useState(mockEspecies.length);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Debounce para a query de busca
  const [debouncedQuery, setDebouncedQuery] = useState(options.query || '');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newQuery = options.query || '';
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    // Se limpou a busca, aplicar imediatamente
    if (!newQuery.trim()) {
      setDebouncedQuery('');
      return;
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(newQuery);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [options.query]);

  // Serializar opções para evitar re-renders desnecessários
  const biomasKey = JSON.stringify(options.biomas || []);
  const tamanhosKey = JSON.stringify(options.tamanhos || []);
  const dificuldadesKey = JSON.stringify(options.dificuldades || []);
  const conservacaoKey = JSON.stringify(options.conservacao || []);
  const producaoKey = JSON.stringify(options.producao || []);
  const generosKey = JSON.stringify(options.generos || []);
  const queryKey = debouncedQuery;
  const limitKey = options.limit || 0;
  const offsetKey = options.offset || 0;

  useEffect(() => {
    let cancelled = false;

    const fetchEspecies = async () => {
      setIsLoading(true);
      setError(null);

      const biomas = options.biomas;
      const tamanhos = options.tamanhos;
      const dificuldades = options.dificuldades;
      const conservacao = options.conservacao;
      const producao = options.producao;
      const generos = options.generos;
      const query = debouncedQuery;

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
        if (producao?.length) {
          filtered = filtered.filter(e => producao.includes(e.producaoMel));
        }
        if (generos?.length) {
          filtered = filtered.filter(e => {
            const genero = e.genero || e.nomeCientifico.split(' ')[0];
            return generos.includes(genero);
          });
        }
        if (query && query.trim()) {
          const q = normalize(query);
          filtered = filtered.filter(e =>
            matchesSearch(e.nomeCientifico, q) ||
            e.nomesPopulares.some(n => matchesSearch(n, q)) ||
            (e.nomesAlternativos || []).some((n: string) => matchesSearch(n, q))
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
        // Se tem termo de busca, usar RPC buscar_especies
        if (query && query.trim()) {
          const { data, error: rpcError } = await supabase
            .rpc('buscar_especies', { termo: query.trim() });

          if (rpcError) throw rpcError;
          if (!cancelled) {
            const mapped = (data || []).map(dbEspecieToApp);
            setEspecies(mapped);
            setTotalCatalogadas(mapped.length);
          }
        } else {
          // Usar RPC filtrar_especies para filtragem avançada
          const hasFilters = biomas?.length || tamanhos?.length || dificuldades?.length ||
                           conservacao?.length || producao?.length || generos?.length;

          const rpcArgs: Record<string, any> = {};
          if (biomas?.length) rpcArgs.p_bioma = biomas[0];
          if (tamanhos?.length) rpcArgs.p_tamanho = tamanhos[0];
          if (dificuldades?.length) rpcArgs.p_dificuldade = dificuldades[0];
          if (conservacao?.length) rpcArgs.p_conservacao = conservacao[0];
          if (producao?.length) rpcArgs.p_producao = producao[0];
          if (generos?.length) rpcArgs.p_genero = generos[0];
          if (options.limit) rpcArgs.p_limit = options.limit;
          if (options.offset) rpcArgs.p_offset = options.offset;

          const { data, error: rpcError } = await supabase
            .rpc('filtrar_especies', rpcArgs);

          if (rpcError) throw rpcError;
          if (!cancelled) {
            const mapped = (data || []).map(dbEspecieToApp);
            setEspecies(mapped);
            // total_count vem em cada row do filtrar_especies
            if (data && data.length > 0 && data[0].total_count != null) {
              setTotalCatalogadas(data[0].total_count);
            } else if (!hasFilters) {
              setTotalCatalogadas(mapped.length);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          console.error('Erro ao buscar espécies:', err);
          // Fallback para query direta do Supabase
          try {
            let q = supabase.from('especies').select('*');
            if (query && query.trim()) {
              q = q.or(`nome_cientifico.ilike.%${query.trim()}%,nomes_populares.cs.{"${query.trim()}"}`);
            }
            if (biomas?.length) q = q.overlaps('biomas', biomas);
            if (tamanhos?.length) q = q.in('tamanho', tamanhos);
            if (dificuldades?.length) q = q.in('manejo_dificuldade', dificuldades);
            if (conservacao?.length) q = q.in('conservacao_status', conservacao);
            const { data } = await q.order('nome_cientifico');
            if (!cancelled && data) {
              setEspecies(data.map(dbEspecieToApp));
              setTotalCatalogadas(data.length);
            }
          } catch {
            // Último fallback: dados mockados com busca local
            const normalizedQuery = query ? normalize(query) : '';
            let fallback = [...mockEspecies];
            if (normalizedQuery) {
              fallback = fallback.filter(e =>
                matchesSearch(e.nomeCientifico, normalizedQuery) ||
                e.nomesPopulares.some(n => matchesSearch(n, normalizedQuery)) ||
                (e.nomesAlternativos || []).some((n: string) => matchesSearch(n, normalizedQuery))
              );
            }
            setEspecies(fallback);
            setTotalCatalogadas(fallback.length);
          }
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
  }, [biomasKey, tamanhosKey, dificuldadesKey, conservacaoKey, producaoKey, generosKey, queryKey, limitKey, offsetKey]);

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

// Busca de espécies por nome (para autocomplete) - usa RPC buscar_especies
export function useBuscarEspecies() {
  const [resultados, setResultados] = useState<typeof mockEspecies>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buscar = async (termo: string) => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }

    setIsLoading(true);

    // Modo offline - buscar nos dados mockados (com normalização de acentos)
    if (!isSupabaseConfigured()) {
      const q = normalize(termo);
      const filtered = mockEspecies.filter(e =>
        matchesSearch(e.nomeCientifico, q) ||
        e.nomesPopulares.some(n => matchesSearch(n, q)) ||
        (e.nomesAlternativos || []).some((n: string) => matchesSearch(n, q))
      );
      setResultados(filtered.slice(0, 10));
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('buscar_especies', { termo: termo.trim() });

      if (error) throw error;
      setResultados((data || []).map(dbEspecieToApp).slice(0, 10));
    } catch (err) {
      console.error('Erro na busca:', err);
      // Fallback para dados mockados com normalização
      const q = normalize(termo);
      const filtered = mockEspecies.filter(e =>
        matchesSearch(e.nomeCientifico, q) ||
        e.nomesPopulares.some(n => matchesSearch(n, q)) ||
        (e.nomesAlternativos || []).some((n: string) => matchesSearch(n, q))
      );
      setResultados(filtered.slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  return { resultados, isLoading, buscar };
}

// Hook para estatísticas do catálogo - usa RPC estatisticas_catalogo
export function useEstatisticasCatalogo() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('estatisticas_catalogo');
        if (error) throw error;
        setStats(data);
      } catch (err) {
        console.error('Erro ao buscar estatísticas do catálogo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}
