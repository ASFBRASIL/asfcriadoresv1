import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { criadores as mockCriadores } from '../data/criadores';
import { especies as mockEspecies } from '../data/especies';

export interface DashboardStats {
  totalCriadores: number;
  totalEspecies: number;
  totalAvaliacoes: number;
  totalContatos: number;
  criadoresPorEstado: { estado: string; count: number }[];
  criadoresPorMes: { mes: string; count: number }[];
  especiesMaisPopulares: { especie: string; count: number }[];
  avaliacoesPorNota: { nota: number; count: number }[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      // Modo offline - usar dados mockados
      if (!isSupabaseConfigured()) {
        // Calcular estatísticas dos dados mockados
        const porEstado = mockCriadores.reduce((acc, c) => {
          acc[c.localizacao.estado] = (acc[c.localizacao.estado] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const porEstadoArray = Object.entries(porEstado)
          .map(([estado, count]) => ({ estado, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setStats({
          totalCriadores: mockCriadores.length,
          totalEspecies: mockEspecies.length,
          totalAvaliacoes: 156,
          totalContatos: 423,
          criadoresPorEstado: porEstadoArray,
          criadoresPorMes: [
            { mes: 'Jan', count: 5 },
            { mes: 'Fev', count: 8 },
            { mes: 'Mar', count: 12 },
            { mes: 'Abr', count: 15 },
            { mes: 'Mai', count: 18 },
            { mes: 'Jun', count: 22 },
          ],
          especiesMaisPopulares: [
            { especie: 'Tetragonisca angustula', count: 45 },
            { especie: 'Melipona scutellaris', count: 32 },
            { especie: 'Melipona quadrifasciata', count: 28 },
            { especie: 'Melipona subnitida', count: 21 },
            { especie: 'Melipona bicolor', count: 18 },
          ],
          avaliacoesPorNota: [
            { nota: 5, count: 89 },
            { nota: 4, count: 45 },
            { nota: 3, count: 15 },
            { nota: 2, count: 5 },
            { nota: 1, count: 2 },
          ],
        });
        setIsLoading(false);
        return;
      }

      try {
        // Tentar usar RPC estatisticas_catalogo para espécies
        let catalogoStats: any = null;
        try {
          const { data: catData } = await supabase.rpc('estatisticas_catalogo');
          catalogoStats = catData;
        } catch {
          // RPC pode não existir ainda, continuar sem ela
        }

        // Total de criadores
        const { count: totalCriadores } = await supabase
          .from('criadores')
          .select('*', { count: 'exact', head: true });

        // Total de espécies (usa catálogo se disponível, senão conta direto)
        let totalEspecies = 0;
        if (catalogoStats && catalogoStats.total_especies != null) {
          totalEspecies = catalogoStats.total_especies;
        } else {
          const { count } = await supabase
            .from('especies')
            .select('*', { count: 'exact', head: true });
          totalEspecies = count || 0;
        }

        // Total de avaliações
        const { count: totalAvaliacoes } = await supabase
          .from('avaliacoes')
          .select('*', { count: 'exact', head: true });

        // Criadores por estado
        const { data: criadoresData } = await supabase
          .from('criadores')
          .select('estado');

        const porEstado = (criadoresData || []).reduce((acc, curr) => {
          const estado = curr.estado ?? 'Desconhecido';
          acc[estado] = (acc[estado] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const criadoresPorEstado = Object.entries(porEstado)
          .map(([estado, count]) => ({ estado, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // Espécies mais populares do catálogo
        const especiesMaisPopulares = catalogoStats?.especies_por_genero
          ? Object.entries(catalogoStats.especies_por_genero as Record<string, number>)
              .map(([especie, count]) => ({ especie, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
          : [];

        setStats({
          totalCriadores: totalCriadores || 0,
          totalEspecies,
          totalAvaliacoes: totalAvaliacoes || 0,
          totalContatos: 0,
          criadoresPorEstado,
          criadoresPorMes: [],
          especiesMaisPopulares,
          avaliacoesPorNota: [],
        });
      } catch (err) {
        setError(err as Error);
        console.error('Erro ao buscar estatísticas:', err);
        // Fallback para dados mockados
        setStats({
          totalCriadores: mockCriadores.length,
          totalEspecies: mockEspecies.length,
          totalAvaliacoes: 156,
          totalContatos: 423,
          criadoresPorEstado: [],
          criadoresPorMes: [],
          especiesMaisPopulares: [],
          avaliacoesPorNota: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}

// Hook para gerenciar usuários (admin)
export function useAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buscarUsuarios = async (search?: string) => {
    setIsLoading(true);

    // Modo offline - usar dados mockados
    if (!isSupabaseConfigured()) {
      let filtered = [...mockCriadores];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c =>
          c.nome.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }
      setUsuarios(filtered.map(c => ({
        id: c.id,
        nome: c.nome,
        email: c.email,
        cidade: c.localizacao.cidade,
        estado: c.localizacao.estado,
        verificado: c.verificado,
        avaliacao_media: c.avaliacao,
        total_avaliacoes: c.totalAvaliacoes,
      })));
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('criadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      // Fallback para dados mockados
      setUsuarios(mockCriadores.map(c => ({
        id: c.id,
        nome: c.nome,
        email: c.email,
        cidade: c.localizacao.cidade,
        estado: c.localizacao.estado,
        verificado: c.verificado,
        avaliacao_media: c.avaliacao,
        total_avaliacoes: c.totalAvaliacoes,
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const verificarCriador = async (criadorId: string, verificado: boolean) => {
    // Modo offline - atualizar localmente
    if (!isSupabaseConfigured()) {
      setUsuarios(prev =>
        prev.map(u =>
          u.id === criadorId ? { ...u, verificado } : u
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('criadores')
        .update({ verificado })
        .eq('id', criadorId);

      if (error) throw error;
      
      // Atualizar lista local
      setUsuarios(prev =>
        prev.map(u =>
          u.id === criadorId ? { ...u, verificado } : u
        )
      );
    } catch (err) {
      console.error('Erro ao verificar criador:', err);
    }
  };

  const excluirCriador = async (criadorId: string) => {
    // Modo offline - remover localmente
    if (!isSupabaseConfigured()) {
      setUsuarios(prev => prev.filter(u => u.id !== criadorId));
      return;
    }

    try {
      const { error } = await supabase
        .from('criadores')
        .delete()
        .eq('id', criadorId);

      if (error) throw error;
      
      setUsuarios(prev => prev.filter(u => u.id !== criadorId));
    } catch (err) {
      console.error('Erro ao excluir criador:', err);
    }
  };

  return {
    usuarios,
    isLoading,
    buscarUsuarios,
    verificarCriador,
    excluirCriador,
  };
}
