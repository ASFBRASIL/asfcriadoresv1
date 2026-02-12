import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ════════════════════════════════════════════
// CONTATOS — Registra quando alguém contata um criador
// ════════════════════════════════════════════

export interface ContatoRecord {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  tipo: 'whatsapp' | 'perfil_view' | 'avaliacao';
  mensagem?: string;
  created_at: string;
}

export function useContatos() {
  const [isLoading, setIsLoading] = useState(false);

  const registrarContato = async (opts: {
    remetenteId?: string;
    destinatarioId: string;
    tipo: ContatoRecord['tipo'];
    mensagem?: string;
  }) => {
    if (!isSupabaseConfigured()) {
      // Modo offline: apenas incrementar contagem local
      console.log('[contato registrado offline]', opts);
      return { success: true };
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('contatos').insert({
        remetente_id: opts.remetenteId || 'anon',
        destinatario_id: opts.destinatarioId,
        tipo: opts.tipo,
        mensagem: opts.mensagem || '',
        lido: false,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Erro ao registrar contato:', err);
      return { success: false, error: (err as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const buscarContatos = async (criadorId: string) => {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('destinatario_id', criadorId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as unknown as ContatoRecord[];
    } catch {
      return [];
    }
  };

  const contarContatos = async (criadorId: string) => {
    if (!isSupabaseConfigured()) return 0;
    try {
      const { count, error } = await supabase
        .from('contatos')
        .select('*', { count: 'exact', head: true })
        .eq('destinatario_id', criadorId);
      if (error) throw error;
      return count || 0;
    } catch {
      return 0;
    }
  };

  return { registrarContato, buscarContatos, contarContatos, isLoading };
}

// ════════════════════════════════════════════
// NOTIFICAÇÕES — Sistema in-app
// ════════════════════════════════════════════

export interface Notificacao {
  id: string;
  usuario_id: string;
  tipo: 'avaliacao' | 'verificacao' | 'contato' | 'sistema';
  titulo: string;
  mensagem: string;
  lida: boolean;
  link?: string;
  created_at: string;
}

export function useNotificacoes(userId?: string) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Dados mock para modo offline
  const mockNotificacoes: Notificacao[] = userId ? [
    { id: '1', usuario_id: userId, tipo: 'avaliacao', titulo: 'Nova avaliação', mensagem: 'Maria Silva avaliou seu perfil com 5 estrelas.', lida: false, link: '/perfil/mock-1', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', usuario_id: userId, tipo: 'contato', titulo: 'Novo contato via WhatsApp', mensagem: 'Pedro Santos entrou em contato pelo WhatsApp.', lida: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', usuario_id: userId, tipo: 'verificacao', titulo: 'Perfil verificado!', mensagem: 'Parabéns! Seu perfil foi verificado pela equipe ASF.', lida: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', usuario_id: userId, tipo: 'sistema', titulo: 'Bem-vindo à plataforma', mensagem: 'Complete seu perfil para aparecer no mapa de criadores.', lida: true, link: '/perfil/mock-1', created_at: new Date(Date.now() - 172800000).toISOString() },
  ] : [];

  const carregar = useCallback(async () => {
    if (!userId) {
      setNotificacoes([]);
      setNaoLidas(0);
      return;
    }
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      setNotificacoes(mockNotificacoes);
      setNaoLidas(mockNotificacoes.filter(n => !n.lida).length);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      const list = (data || []) as Notificacao[];
      setNotificacoes(list);
      setNaoLidas(list.filter(n => !n.lida).length);
    } catch {
      // Tabela pode não existir ou erro de rede - mostrar 0 notificações
      setNotificacoes([]);
      setNaoLidas(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { carregar(); }, [carregar]);

  const marcarLida = async (id: string) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    setNaoLidas(prev => Math.max(0, prev - 1));

    if (isSupabaseConfigured()) {
      await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    }
  };

  const marcarTodasLidas = async () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    setNaoLidas(0);

    if (isSupabaseConfigured() && userId) {
      await supabase.from('notificacoes').update({ lida: true }).eq('usuario_id', userId).eq('lida', false);
    }
  };

  // Helper: criar notificação (usado internamente ou pelo admin)
  const criarNotificacao = async (opts: {
    usuarioId: string;
    tipo: Notificacao['tipo'];
    titulo: string;
    mensagem: string;
    link?: string;
  }) => {
    if (!isSupabaseConfigured()) {
      const nova: Notificacao = { id: `local-${Date.now()}`, usuario_id: opts.usuarioId, tipo: opts.tipo, titulo: opts.titulo, mensagem: opts.mensagem, lida: false, link: opts.link, created_at: new Date().toISOString() };
      if (opts.usuarioId === userId) {
        setNotificacoes(prev => [nova, ...prev]);
        setNaoLidas(prev => prev + 1);
      }
      return { success: true };
    }

    try {
      const { error } = await supabase.from('notificacoes').insert({
        usuario_id: opts.usuarioId,
        tipo: opts.tipo,
        titulo: opts.titulo,
        mensagem: opts.mensagem,
        lida: false,
        link: opts.link,
      });
      if (error) throw error;
      if (opts.usuarioId === userId) carregar();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  return { notificacoes, naoLidas, isLoading, carregar, marcarLida, marcarTodasLidas, criarNotificacao };
}
