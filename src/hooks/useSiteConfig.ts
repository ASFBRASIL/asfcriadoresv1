import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ============================================================
// TIPOS
// ============================================================

export interface SiteConfig {
  [chave: string]: any;
}

export interface BannerItem {
  titulo: string;
  descricao: string;
  cta: string;
  link: string;
  cor: 'green' | 'yellow' | 'blue' | 'purple' | 'red';
  imagem_url?: string;
  ativo: boolean;
}

// Defaults estáticos caso o DB não esteja disponível
const DEFAULTS: SiteConfig = {
  hero_titulo: 'Encontre criadores de abelhas sem ferrão no Brasil',
  hero_subtitulo: 'Conectando apaixonados pela meliponicultura em todo o território nacional para preservar nossas espécies nativas e fortalecer a comunidade de criadores.',
  hero_imagem: '/images/banner-home-optimized.jpg',
  stats_criadores: '+500',
  stats_especies: '+50',
  stats_estados: '27',
  contato_email: 'contato@asfcriadores.com.br',
  contato_telefone: '(11) 99999-0000',
  redes_instagram: 'https://instagram.com/asfcriadores',
  redes_facebook: 'https://facebook.com/asfcriadores',
  redes_youtube: 'https://youtube.com/@asfcriadores',
  banners: [
    { titulo: 'Produtos para Meliponicultura', descricao: 'Caixas racionais, ferramentas e acessórios para seu meliponário', cta: 'Ver produtos', link: '/mapa', cor: 'green', ativo: true },
    { titulo: 'Aprenda sobre Meliponicultura', descricao: 'Conheça as espécies de abelhas sem ferrão nativas do Brasil', cta: 'Explorar espécies', link: '/especies', cor: 'yellow', ativo: true },
    { titulo: 'Encontre Criadores Próximos', descricao: 'Use nosso mapa interativo para localizar meliponicultores', cta: 'Explorar mapa', link: '/mapa', cor: 'blue', ativo: true },
  ],
};

// Cache global para evitar re-fetch em cada componente
let configCache: SiteConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// ============================================================
// HOOK DE LEITURA (para componentes do site)
// ============================================================

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(configCache || DEFAULTS);
  const [isLoading, setIsLoading] = useState(!configCache);

  useEffect(() => {
    // Se cache ainda é válido, usar
    if (configCache && Date.now() - cacheTime < CACHE_TTL) {
      setConfig(configCache);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setConfig(DEFAULTS);
      setIsLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        const { data } = await supabase.from('site_config').select('chave, valor');
        if (data && data.length > 0) {
          const cfg: SiteConfig = { ...DEFAULTS };
          data.forEach((row: any) => {
            cfg[row.chave] = row.valor;
          });
          configCache = cfg;
          cacheTime = Date.now();
          setConfig(cfg);
        }
      } catch {
        setConfig(DEFAULTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading };
}

// ============================================================
// HOOK DE ADMIN (CRUD completo para site_config)
// ============================================================

export interface SiteConfigRow {
  id: string;
  chave: string;
  valor: any;
  tipo: 'texto' | 'imagem' | 'banner' | 'cor' | 'json';
  descricao: string;
  updated_at: string;
}

export function useAdminSiteConfig() {
  const [configs, setConfigs] = useState<SiteConfigRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buscar = useCallback(async () => {
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      // Gerar mock a partir dos defaults
      const rows = Object.entries(DEFAULTS).map(([chave, valor], i) => ({
        id: `mock-${i}`,
        chave,
        valor,
        tipo: (chave === 'banners' ? 'banner' : chave.includes('imagem') ? 'imagem' : 'texto') as SiteConfigRow['tipo'],
        descricao: '',
        updated_at: new Date().toISOString(),
      }));
      setConfigs(rows);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .order('chave');
      if (data) setConfigs(data as SiteConfigRow[]);
    } catch (err) {
      console.error('Erro ao buscar site_config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizar = async (chave: string, valor: any) => {
    if (!isSupabaseConfigured()) {
      setConfigs(prev => prev.map(c => c.chave === chave ? { ...c, valor, updated_at: new Date().toISOString() } : c));
      configCache = null; // invalidar cache
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('site_config')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('chave', chave);
      if (error) throw error;
      setConfigs(prev => prev.map(c => c.chave === chave ? { ...c, valor, updated_at: new Date().toISOString() } : c));
      configCache = null; // invalidar cache
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const criar = async (row: Omit<SiteConfigRow, 'id' | 'updated_at'>) => {
    if (!isSupabaseConfigured()) {
      const novo = { ...row, id: `new-${Date.now()}`, updated_at: new Date().toISOString() };
      setConfigs(prev => [...prev, novo]);
      configCache = null;
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('site_config')
        .insert({ chave: row.chave, valor: row.valor, tipo: row.tipo, descricao: row.descricao })
        .select()
        .single();
      if (error) throw error;
      setConfigs(prev => [...prev, data as SiteConfigRow]);
      configCache = null;
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const excluir = async (chave: string) => {
    if (!isSupabaseConfigured()) {
      setConfigs(prev => prev.filter(c => c.chave !== chave));
      configCache = null;
      return { success: true };
    }

    try {
      const { error } = await supabase.from('site_config').delete().eq('chave', chave);
      if (error) throw error;
      setConfigs(prev => prev.filter(c => c.chave !== chave));
      configCache = null;
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  // Upload de imagem para o bucket site_images
  const uploadImagem = async (file: File, pasta: string = 'geral') => {
    if (!isSupabaseConfigured()) {
      return { success: true, url: URL.createObjectURL(file) };
    }

    const ext = file.name.split('.').pop();
    const fileName = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('site_images')
        .getPublicUrl(fileName);

      return { success: true, url: urlData.publicUrl };
    } catch (err) {
      return { success: false, error: (err as Error).message, url: '' };
    }
  };

  return { configs, isLoading, buscar, atualizar, criar, excluir, uploadImagem };
}
