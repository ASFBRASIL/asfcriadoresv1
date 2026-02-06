import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase - devem ser configuradas via variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de segurança - garante que as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase não configurado! Configure as variáveis de ambiente:\n' +
    '  VITE_SUPABASE_URL=https://seu-projeto.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=sua-chave-anon'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'));
};

// Tipos para o banco de dados
export type CriadorRole = 'criador' | 'admin' | 'moderador';

export type Criador = {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  avatar_url?: string;
  bio?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  status: ('venda' | 'troca' | 'informacao')[];
  verificado: boolean;
  avaliacao_media: number;
  total_avaliacoes: number;
  role?: CriadorRole;
  created_at: string;
  updated_at: string;
};

export type Especie = {
  id: string;
  slug: string;
  nome_cientifico: string;
  nomes_populares: string[];
  familia: string;
  tamanho: 'pequena' | 'média' | 'grande';
  producao_mel: 'baixa' | 'média' | 'alta' | 'muito alta';
  distribuicao: string[];
  biomas: string[];
  caracteristicas: string[];
  comportamento: string;
  mel_descricao: string;
  mel_propriedades: string[];
  mel_sabor: string;
  manejo_dificuldade: 'iniciante' | 'intermediário' | 'avançado';
  manejo_caixa: string;
  manejo_temperamento: string;
  manejo_cuidados: string[];
  conservacao_status: 'comum' | 'vulnerável' | 'ameaçada' | 'rara';
  conservacao_ameacas: string[];
  imagem_url?: string;
  fontes: string[];
  created_at: string;
};

// Converte row do Supabase (snake_case flat) para formato do app (camelCase nested)
export function dbEspecieToApp(row: any) {
  return {
    id: row.slug || row.id,
    nomeCientifico: row.nome_cientifico,
    nomesPopulares: row.nomes_populares || [],
    familia: row.familia || 'Apidae',
    tamanho: row.tamanho || 'média',
    producaoMel: row.producao_mel || 'média',
    distribuicao: row.distribuicao || [],
    biomas: row.biomas || [],
    caracteristicas: row.caracteristicas || [],
    comportamento: row.comportamento || '',
    mel: {
      descricao: row.mel_descricao || '',
      propriedades: row.mel_propriedades || [],
      sabor: row.mel_sabor || '',
    },
    manejo: {
      dificuldade: row.manejo_dificuldade || 'intermediário',
      caixaIdeal: row.manejo_caixa || '',
      temperamento: row.manejo_temperamento || '',
      cuidadosEspeciais: row.manejo_cuidados || [],
    },
    conservacao: {
      status: row.conservacao_status || 'comum',
      ameacas: row.conservacao_ameacas || [],
    },
    imagem: row.imagem_url,
    fontes: row.fontes || [],
  };
}

export type CriadorEspecie = {
  id: string;
  criador_id: string;
  especie_id: string;
  quantidade?: number;
  preco?: number;
  disponivel: boolean;
  observacoes?: string;
  created_at: string;
};

export type Avaliacao = {
  id: string;
  criador_id: string;
  autor_id: string;
  autor_nome: string;
  nota: number;
  comentario?: string;
  created_at: string;
};

export type Favorito = {
  id: string;
  usuario_id: string;
  criador_id: string;
  created_at: string;
};

export type Contato = {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  mensagem: string;
  lido: boolean;
  created_at: string;
};
