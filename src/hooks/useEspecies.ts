import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEspecies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo offline - usar dados mockados
    if (!isSupabaseConfigured()) {
      let filtered = [...mockEspecies];

      // Aplicar filtros
      if (options.biomas?.length) {
        filtered = filtered.filter(e => e.biomas.some(b => options.biomas?.includes(b)));
      }

      if (options.tamanhos?.length) {
        filtered = filtered.filter(e => options.tamanhos?.includes(e.tamanho));
      }

      if (options.dificuldades?.length) {
        filtered = filtered.filter(e => options.dificuldades?.includes(e.manejo.dificuldade));
      }

      if (options.conservacao?.length) {
        filtered = filtered.filter(e => options.conservacao?.includes(e.conservacao.status));
      }

      if (options.query) {
        const q = options.query.toLowerCase();
        filtered = filtered.filter(e =>
          e.nomeCientifico.toLowerCase().includes(q) ||
          e.nomesPopulares.some(n => n.toLowerCase().includes(q))
        );
      }

      setEspecies(filtered);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase.from('especies').select('*');

      // Filtro por bioma
      if (options.biomas?.length) {
        query = query.overlaps('biomas', options.biomas);
      }

      // Filtro por tamanho
      if (options.tamanhos?.length) {
        query = query.in('tamanho', options.tamanhos);
      }

      // Filtro por dificuldade
      if (options.dificuldades?.length) {
        query = query.in('manejo_dificuldade', options.dificuldades);
      }

      // Filtro por conservação
      if (options.conservacao?.length) {
        query = query.in('conservacao_status', options.conservacao);
      }

      // Busca por texto (nome científico ou popular)
      if (options.query) {
        const searchTerm = options.query.toLowerCase();
        query = query.or(`nome_cientifico.ilike.%${searchTerm}%,nomes_populares.cs.{${searchTerm}}`);
      }

      const { data, error: queryError } = await query.order('nome_cientifico');

      if (queryError) throw queryError;
      setEspecies((data || []).map(dbEspecieToApp));
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar espécies:', err);
      // Fallback para dados mockados
      setEspecies(mockEspecies);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchEspecies();
  }, [fetchEspecies]);

  return { especies, isLoading, error, refetch: fetchEspecies };
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
