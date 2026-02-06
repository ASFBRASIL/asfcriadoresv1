import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface WhatsAppMessage {
  phone: string;
  message: string;
}

interface WhatsAppAPIResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Hook para integração com WhatsApp
export function useWhatsApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abrir WhatsApp Web/App com mensagem pré-preenchida
  const abrirWhatsApp = (phone: string, message?: string, opts?: { remetenteId?: string; destinatarioId?: string }) => {
    // Remover caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    const phoneWithCountry = cleanPhone.startsWith('55') 
      ? cleanPhone 
      : `55${cleanPhone}`;

    // Criar URL do WhatsApp
    const baseUrl = 'https://wa.me/';
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    const whatsappUrl = `${baseUrl}${phoneWithCountry}${encodedMessage}`;

    // Registrar contato no banco
    if (opts?.destinatarioId && isSupabaseConfigured()) {
      supabase.from('contatos').insert({
        remetente_id: opts.remetenteId || 'anon',
        destinatario_id: opts.destinatarioId,
        mensagem: message || 'Contato via WhatsApp',
        lido: false,
      }).then(() => {}, console.error);
    }

    // Abrir em nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Template de mensagens pré-definidas
  const getMensagemTemplate = (
    tipo: 'primeiro_contato' | 'interesse_colonia' | 'troca' | 'informacao',
    dados: {
      nomeCriador?: string;
      especie?: string;
    }
  ): string => {
    const { nomeCriador, especie } = dados;

    switch (tipo) {
      case 'primeiro_contato':
        return `Olá ${nomeCriador || ''}! 👋\n\nEncontrei seu perfil na ASF Criadores e gostaria de saber mais sobre seu trabalho com meliponicultura.\n\nPodemos conversar?`;

      case 'interesse_colonia':
        return `Olá ${nomeCriador || ''}! 👋\n\nVi no ASF Criadores que você trabalha com ${especie || 'abelhas sem ferrão'}.\n\nTenho interesse em adquirir uma colônia. Você tem disponibilidade?\n\nObrigado!`;

      case 'troca':
        return `Olá ${nomeCriador || ''}! 👋\n\nEncontrei seu perfil na ASF Criadores e vi que você trabalha com ${especie || 'abelhas nativas'}.\n\nTenho interesse em fazer uma troca de colônias. Você topa conversar sobre isso?`;

      case 'informacao':
        return `Olá ${nomeCriador || ''}! 👋\n\nEncontrei seu perfil na ASF Criadores e gostaria de tirar algumas dúvidas sobre criação de ${especie || 'abelhas sem ferrão'}.\n\nPoderia me ajudar?`;

      default:
        return `Olá! Encontrei seu perfil na ASF Criadores. Podemos conversar?`;
    }
  };

  // Enviar mensagem via API (requer configuração de provedor)
  const enviarMensagemAPI = async (
    _message: WhatsAppMessage
  ): Promise<WhatsAppAPIResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Aqui você integraria com uma API real como:
      // - Twilio WhatsApp API
      // - Meta Business API
      // - WPPConnect
      // - Evolution API

      // Exemplo com Twilio (requer configuração no backend):
      // const response = await fetch('/api/whatsapp/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(message),
      // });

      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        messageId: `msg_${Date.now()}`,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Compartilhar perfil do criador
  const compartilharPerfil = (criador: {
    nome: string;
    cidade: string;
    estado: string;
    especies: string[];
  }) => {
    const texto = `🐝 *${criador.nome}* - Criador de Abelhas sem Ferrão\n\n` +
      `📍 ${criador.cidade}, ${criador.estado}\n` +
      `🍯 Espécies: ${criador.especies.join(', ')}\n\n` +
      `Encontre mais criadores em: https://asfcriadores.com.br`;

    if (navigator.share) {
      navigator.share({
        title: criador.nome,
        text: texto,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(texto);
      alert('Texto copiado para a área de transferência!');
    }
  };

  return {
    abrirWhatsApp,
    getMensagemTemplate,
    enviarMensagemAPI,
    compartilharPerfil,
    isLoading,
    error,
  };
}

// Hook para gerenciar contatos favoritos (persistente no Supabase)
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar favoritos do usuário
  const carregarFavoritos = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      // Modo offline: carregar do localStorage
      try {
        const saved = localStorage.getItem('asf_favoritos');
        if (saved) setFavoritos(JSON.parse(saved));
      } catch { /* ignore */ }
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('criador_id')
        .eq('usuario_id', userId);

      if (error) throw error;
      setFavoritos((data || []).map(f => f.criador_id));
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
      // Fallback localStorage
      try {
        const saved = localStorage.getItem('asf_favoritos');
        if (saved) setFavoritos(JSON.parse(saved));
      } catch { /* ignore */ }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adicionarFavorito = async (criadorId: string, userId?: string) => {
    // Atualizar estado imediatamente (otimista)
    setFavoritos(prev => [...prev, criadorId]);

    if (!isSupabaseConfigured() || !userId) {
      // Modo offline: salvar no localStorage
      const updated = [...favoritos, criadorId];
      try { localStorage.setItem('asf_favoritos', JSON.stringify(updated)); } catch { /* ignore */ }
      return;
    }

    try {
      const { error } = await supabase.from('favoritos').insert({
        usuario_id: userId,
        criador_id: criadorId,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
      // Reverter em caso de erro
      setFavoritos(prev => prev.filter(id => id !== criadorId));
    }
  };

  const removerFavorito = async (criadorId: string, userId?: string) => {
    // Atualizar estado imediatamente (otimista)
    setFavoritos(prev => prev.filter(id => id !== criadorId));

    if (!isSupabaseConfigured() || !userId) {
      const updated = favoritos.filter(id => id !== criadorId);
      try { localStorage.setItem('asf_favoritos', JSON.stringify(updated)); } catch { /* ignore */ }
      return;
    }

    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', userId)
        .eq('criador_id', criadorId);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      // Reverter em caso de erro
      setFavoritos(prev => [...prev, criadorId]);
    }
  };

  const isFavorito = (criadorId: string) => favoritos.includes(criadorId);

  return {
    favoritos,
    isLoading,
    carregarFavoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
  };
}
