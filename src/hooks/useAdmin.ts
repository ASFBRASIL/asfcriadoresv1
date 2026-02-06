import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { criadores as mockCriadores } from '../data/criadores';
import { especies as mockEspecies } from '../data/especies';

// ============================================================
// TIPOS
// ============================================================

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

export interface AdminCriador {
  id: string;
  user_id?: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  bio?: string;
  avatar_url?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  status: string[];
  verificado: boolean;
  avaliacao_media: number;
  total_avaliacoes: number;
  created_at: string;
  updated_at?: string;
}

export interface AdminAvaliacao {
  id: string;
  criador_id: string;
  criador_nome?: string;
  autor_id: string;
  autor_nome: string;
  nota: number;
  comentario?: string;
  created_at: string;
}

export interface AdminEspecie {
  id: string;
  nomeCientifico: string;
  nomesPopulares: string[];
  familia: string;
  tamanho: string;
  producaoMel: string;
  manejo: { dificuldade: string; caixaIdeal: string; temperamento: string; cuidadosEspeciais: string[] };
  conservacao: { status: string; ameacas: string[] };
  distribuicao: string[];
  biomas: string[];
  caracteristicas: string[];
  comportamento: string;
  mel: { descricao: string; propriedades: string[]; sabor: string };
  imagem?: string;
  fontes: string[];
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      const porEstado = mockCriadores.reduce((acc, c) => {
        const est = c.localizacao?.estado || c.estado;
        acc[est] = (acc[est] || 0) + 1;
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
          { mes: 'Jan', count: 5 }, { mes: 'Fev', count: 8 },
          { mes: 'Mar', count: 12 }, { mes: 'Abr', count: 15 },
          { mes: 'Mai', count: 18 }, { mes: 'Jun', count: 22 },
        ],
        especiesMaisPopulares: [
          { especie: 'Jataí', count: 45 },
          { especie: 'Uruçu-amarela', count: 32 },
          { especie: 'Mandaçaia', count: 28 },
          { especie: 'Jandaíra', count: 21 },
          { especie: 'Guaraipo', count: 18 },
        ],
        avaliacoesPorNota: [
          { nota: 5, count: 89 }, { nota: 4, count: 45 },
          { nota: 3, count: 15 }, { nota: 2, count: 5 }, { nota: 1, count: 2 },
        ],
      });
      setIsLoading(false);
      return;
    }

    try {
      const { count: totalCriadores } = await supabase
        .from('criadores').select('*', { count: 'exact', head: true });
      const { count: totalEspecies } = await supabase
        .from('especies').select('*', { count: 'exact', head: true });
      const { count: totalAvaliacoes } = await supabase
        .from('avaliacoes').select('*', { count: 'exact', head: true });

      const { data: criadoresData } = await supabase.from('criadores').select('estado');
      const porEstado = (criadoresData || []).reduce((acc, curr) => {
        acc[curr.estado] = (acc[curr.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalCriadores: totalCriadores || 0,
        totalEspecies: totalEspecies || 0,
        totalAvaliacoes: totalAvaliacoes || 0,
        totalContatos: 0,
        criadoresPorEstado: Object.entries(porEstado)
          .map(([estado, count]) => ({ estado, count }))
          .sort((a, b) => b.count - a.count).slice(0, 10),
        criadoresPorMes: [],
        especiesMaisPopulares: [],
        avaliacoesPorNota: [],
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  return { stats, isLoading, error, refetch: fetchStats };
}

// ============================================================
// ADMIN CRIADORES (CRUD completo)
// ============================================================

export function useAdminCriadores() {
  const [criadores, setCriadores] = useState<AdminCriador[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (opts?: { search?: string; estado?: string; verificado?: 'todos' | 'sim' | 'nao' }) => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      let filtered = mockCriadores.map(c => ({
        id: c.id, user_id: c.user_id, nome: c.nome, email: c.email,
        telefone: c.telefone, whatsapp: c.whatsapp, bio: c.bio,
        avatar_url: c.avatar_url,
        endereco: c.localizacao?.endereco || c.endereco,
        cidade: c.localizacao?.cidade || c.cidade,
        estado: c.localizacao?.estado || c.estado,
        cep: c.localizacao?.cep || c.cep,
        latitude: c.localizacao?.latitude || c.latitude,
        longitude: c.localizacao?.longitude || c.longitude,
        status: c.status, verificado: c.verificado,
        avaliacao_media: c.avaliacao ?? c.avaliacao_media,
        total_avaliacoes: c.totalAvaliacoes ?? c.total_avaliacoes,
        created_at: c.created_at, updated_at: c.updated_at,
      })) as AdminCriador[];

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        filtered = filtered.filter(c => c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.cidade.toLowerCase().includes(q));
      }
      if (opts?.estado) filtered = filtered.filter(c => c.estado === opts.estado);
      if (opts?.verificado === 'sim') filtered = filtered.filter(c => c.verificado);
      if (opts?.verificado === 'nao') filtered = filtered.filter(c => !c.verificado);

      setCriadores(filtered);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase.from('criadores').select('*').order('created_at', { ascending: false });
      if (opts?.search) query = query.or(`nome.ilike.%${opts.search}%,email.ilike.%${opts.search}%,cidade.ilike.%${opts.search}%`);
      if (opts?.estado) query = query.eq('estado', opts.estado);
      if (opts?.verificado === 'sim') query = query.eq('verificado', true);
      if (opts?.verificado === 'nao') query = query.eq('verificado', false);

      const { data, error: e } = await query;
      if (e) throw e;
      setCriadores((data || []) as AdminCriador[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizar = async (id: string, updates: Partial<AdminCriador>) => {
    if (!isSupabaseConfigured()) {
      setCriadores(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { success: true };
    }
    try {
      const { error: e } = await supabase.from('criadores').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      if (e) throw e;
      setCriadores(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const verificar = async (id: string, verificado: boolean) => atualizar(id, { verificado });

  const excluir = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setCriadores(prev => prev.filter(c => c.id !== id));
      return { success: true };
    }
    try {
      const { error: e } = await supabase.from('criadores').delete().eq('id', id);
      if (e) throw e;
      setCriadores(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  return { criadores, isLoading, error, buscar, atualizar, verificar, excluir };
}

// ============================================================
// ADMIN ESPÉCIES (CRUD completo)
// ============================================================

export function useAdminEspecies() {
  const [especies, setEspecies] = useState<AdminEspecie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (search?: string) => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      let filtered = mockEspecies as AdminEspecie[];
      if (search) {
        const q = search.toLowerCase();
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
      let query = supabase.from('especies').select('*').order('nome_cientifico');
      if (search) query = query.or(`nome_cientifico.ilike.%${search}%`);
      const { data, error: e } = await query;
      if (e) throw e;
      setEspecies((data || []) as any);
    } catch (err) {
      setError((err as Error).message);
      setEspecies(mockEspecies as AdminEspecie[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const criar = async (especie: Partial<AdminEspecie>) => {
    if (!isSupabaseConfigured()) {
      const nova = { ...especie, id: `new-${Date.now()}` } as AdminEspecie;
      setEspecies(prev => [nova, ...prev]);
      return { success: true, data: nova };
    }
    try {
      const { data, error: e } = await supabase.from('especies').insert(especie).select().single();
      if (e) throw e;
      setEspecies(prev => [data as any, ...prev]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const atualizar = async (id: string, updates: Partial<AdminEspecie>) => {
    if (!isSupabaseConfigured()) {
      setEspecies(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { success: true };
    }
    try {
      const { error: e } = await supabase.from('especies').update(updates as any).eq('id', id);
      if (e) throw e;
      setEspecies(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const excluir = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setEspecies(prev => prev.filter(e => e.id !== id));
      return { success: true };
    }
    try {
      const { error: e } = await supabase.from('especies').delete().eq('id', id);
      if (e) throw e;
      setEspecies(prev => prev.filter(e => e.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  return { especies, isLoading, error, buscar, criar, atualizar, excluir };
}

// ============================================================
// ADMIN AVALIAÇÕES (listagem + moderação)
// ============================================================

export function useAdminAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<AdminAvaliacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockAvaliacoes: AdminAvaliacao[] = [
    { id: '1', criador_id: '1', criador_nome: 'João Martins', autor_id: 'u1', autor_nome: 'Maria Silva', nota: 5, comentario: 'Excelente criador! Muito atencioso e as colônias estavam em ótimo estado.', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: '2', criador_id: '1', criador_nome: 'João Martins', autor_id: 'u2', autor_nome: 'Pedro Santos', nota: 4, comentario: 'Bom atendimento, recomendo!', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: '3', criador_id: '2', criador_nome: 'Maria Costa', autor_id: 'u3', autor_nome: 'Ana Oliveira', nota: 5, comentario: 'Criadora muito experiente, me ensinou bastante sobre Uruçu.', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: '4', criador_id: '3', criador_nome: 'Carlos Silva', autor_id: 'u4', autor_nome: 'Luiz Pereira', nota: 3, comentario: 'Demorou para responder, mas as abelhas chegaram bem.', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: '5', criador_id: '2', criador_nome: 'Maria Costa', autor_id: 'u5', autor_nome: 'Roberto Lima', nota: 1, comentario: 'Conteúdo inapropriado para teste de moderação.', created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  ];

  const buscar = useCallback(async (opts?: { criadorId?: string; notaMin?: number; notaMax?: number }) => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      let filtered = [...mockAvaliacoes];
      if (opts?.criadorId) filtered = filtered.filter(a => a.criador_id === opts.criadorId);
      if (opts?.notaMin !== undefined) filtered = filtered.filter(a => a.nota >= opts.notaMin!);
      if (opts?.notaMax !== undefined) filtered = filtered.filter(a => a.nota <= opts.notaMax!);
      setAvaliacoes(filtered);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase.from('avaliacoes').select('*').order('created_at', { ascending: false });
      if (opts?.criadorId) query = query.eq('criador_id', opts.criadorId);
      if (opts?.notaMin !== undefined) query = query.gte('nota', opts.notaMin);
      if (opts?.notaMax !== undefined) query = query.lte('nota', opts.notaMax);

      const { data, error: e } = await query;
      if (e) throw e;
      setAvaliacoes((data || []) as AdminAvaliacao[]);
    } catch (err) {
      setError((err as Error).message);
      setAvaliacoes(mockAvaliacoes);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const excluir = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setAvaliacoes(prev => prev.filter(a => a.id !== id));
      return { success: true };
    }
    try {
      const { error: e } = await supabase.from('avaliacoes').delete().eq('id', id);
      if (e) throw e;
      setAvaliacoes(prev => prev.filter(a => a.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  return { avaliacoes, isLoading, error, buscar, excluir };
}
