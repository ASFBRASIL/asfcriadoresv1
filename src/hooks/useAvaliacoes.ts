import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Avaliacao {
  id: string;
  criador_id: string;
  autor_id: string;
  autor_nome: string;
  autor_avatar?: string;
  nota: number;
  comentario?: string;
  created_at: string;
}

// Avaliações mockadas para modo offline
const mockAvaliacoes: Avaliacao[] = [
  {
    id: '1',
    criador_id: '1',
    autor_id: 'user1',
    autor_nome: 'Maria Silva',
    nota: 5,
    comentario: 'Excelente criador! Muito atencioso e as colônias estavam em ótimo estado.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    criador_id: '1',
    autor_id: 'user2',
    autor_nome: 'João Santos',
    nota: 4,
    comentario: 'Bom atendimento, recomendo!',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useAvaliacoes(criadorId: string | null) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [media, setMedia] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchAvaliacoes = useCallback(async () => {
    if (!criadorId) {
      setAvaliacoes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Modo offline - usar dados mockados
    if (!isSupabaseConfigured()) {
      const filtered = mockAvaliacoes.filter(a => a.criador_id === criadorId);
      setAvaliacoes(filtered);
      
      if (filtered.length > 0) {
        const soma = filtered.reduce((acc, a) => acc + a.nota, 0);
        setMedia(soma / filtered.length);
        setTotal(filtered.length);
      } else {
        setMedia(0);
        setTotal(0);
      }
      
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('criador_id', criadorId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const avaliacoesData = data || [];
      setAvaliacoes(avaliacoesData as Avaliacao[]);
      
      // Calcular média
      if (avaliacoesData.length > 0) {
        const soma = avaliacoesData.reduce((acc, a) => acc + a.nota, 0);
        setMedia(soma / avaliacoesData.length);
        setTotal(avaliacoesData.length);
      } else {
        setMedia(0);
        setTotal(0);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao buscar avaliações:', err);
      // Fallback para dados mockados
      const filtered = mockAvaliacoes.filter(a => a.criador_id === criadorId);
      setAvaliacoes(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [criadorId]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const adicionarAvaliacao = async (
    criadorId: string,
    autorId: string,
    autorNome: string,
    nota: number,
    comentario?: string
  ) => {
    // Modo offline - adicionar localmente
    if (!isSupabaseConfigured()) {
      const novaAvaliacao: Avaliacao = {
        id: `mock-${Date.now()}`,
        criador_id: criadorId,
        autor_id: autorId,
        autor_nome: autorNome,
        nota,
        comentario,
        created_at: new Date().toISOString(),
      };
      setAvaliacoes(prev => [novaAvaliacao, ...prev]);
      return { data: novaAvaliacao, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert({
          criador_id: criadorId,
          autor_id: autorId,
          autor_nome: autorNome,
          nota,
          comentario,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar média do criador
      await atualizarMediaCriador(criadorId);

      await fetchAvaliacoes();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const atualizarMediaCriador = async (criadorId: string) => {
    try {
      const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('nota')
        .eq('criador_id', criadorId);

      if (avaliacoes && avaliacoes.length > 0) {
        const media = avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length;
        
        await supabase
          .from('criadores')
          .update({
            avaliacao_media: media,
            total_avaliacoes: avaliacoes.length,
          })
          .eq('id', criadorId);
      }
    } catch (err) {
      console.error('Erro ao atualizar média:', err);
    }
  };

  return {
    avaliacoes,
    isLoading,
    error,
    media,
    total,
    refetch: fetchAvaliacoes,
    adicionarAvaliacao,
  };
}
