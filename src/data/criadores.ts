// Criadores data - formato compatível com Supabase

export interface CriadorData {
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
  created_at: string;
  updated_at: string;
  // Campos extras para compatibilidade
  especies: string[];
  descricao: string;
  avaliacao: number;
  totalAvaliacoes: number;
  localizacao: {
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude: number;
    longitude: number;
  };
}

export const criadores: CriadorData[] = [
  {
    id: '1',
    user_id: 'user-1',
    nome: 'João Martins',
    email: 'joao.martins@email.com',
    telefone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    bio: 'Meliponicultor há 5 anos, especializado em Jataí e Mandaçaia.',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    latitude: -23.5505,
    longitude: -46.6333,
    status: ['venda', 'troca'],
    verificado: true,
    avaliacao_media: 4.8,
    total_avaliacoes: 12,
    created_at: '2023-03-15T00:00:00Z',
    updated_at: '2023-03-15T00:00:00Z',
    especies: ['tetragonisca-angustula', 'melipona-quadrifasciata', 'scaptotrigona-postica'],
    descricao: 'Meliponicultor há 5 anos, especializado em Jataí e Mandaçaia.',
    avaliacao: 4.8,
    totalAvaliacoes: 12,
    localizacao: {
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      latitude: -23.5505,
      longitude: -46.6333
    }
  },
  {
    id: '2',
    user_id: 'user-2',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    telefone: '(21) 99876-5432',
    whatsapp: '5521998765432',
    bio: 'Apaixonada por abelhas nativas, foco em preservação.',
    endereco: 'Av. das Abelhas, 456',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '20000-000',
    latitude: -22.9068,
    longitude: -43.1729,
    status: ['venda', 'informacao'],
    verificado: true,
    avaliacao_media: 4.9,
    total_avaliacoes: 8,
    created_at: '2023-06-20T00:00:00Z',
    updated_at: '2023-06-20T00:00:00Z',
    especies: ['tetragonisca-angustula', 'melipona-marginata'],
    descricao: 'Apaixonada por abelhas nativas, foco em preservação.',
    avaliacao: 4.9,
    totalAvaliacoes: 8,
    localizacao: {
      endereco: 'Av. das Abelhas, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000-000',
      latitude: -22.9068,
      longitude: -43.1729
    }
  },
  {
    id: '3',
    user_id: 'user-3',
    nome: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    telefone: '(31) 98765-1234',
    whatsapp: '5531987651234',
    bio: 'Criador de Uruçu-amarela e outras espécies do Cerrado.',
    endereco: 'Rua do Mel, 789',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30000-000',
    latitude: -19.9167,
    longitude: -43.9345,
    status: ['venda', 'troca', 'informacao'],
    verificado: true,
    avaliacao_media: 4.7,
    total_avaliacoes: 15,
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2023-01-10T00:00:00Z',
    especies: ['melipona-rufiventris', 'scaptotrigona-depilis', 'tetragonisca-angustula'],
    descricao: 'Criador de Uruçu-amarela e outras espécies do Cerrado.',
    avaliacao: 4.7,
    totalAvaliacoes: 15,
    localizacao: {
      endereco: 'Rua do Mel, 789',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30000-000',
      latitude: -19.9167,
      longitude: -43.9345
    }
  },
  {
    id: '4',
    user_id: 'user-4',
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    telefone: '(71) 99876-1234',
    whatsapp: '5571998761234',
    bio: 'Especialista em espécies do Nordeste, Uruçu e Jandaíra.',
    endereco: 'Rua da Caatinga, 321',
    cidade: 'Salvador',
    estado: 'BA',
    cep: '40000-000',
    latitude: -12.9714,
    longitude: -38.5014,
    status: ['venda', 'troca'],
    verificado: true,
    avaliacao_media: 5.0,
    total_avaliacoes: 20,
    created_at: '2022-11-05T00:00:00Z',
    updated_at: '2022-11-05T00:00:00Z',
    especies: ['melipona-scutellaris', 'melipona-subnitida', 'melipona-asilvai'],
    descricao: 'Especialista em espécies do Nordeste, Uruçu e Jandaíra.',
    avaliacao: 5.0,
    totalAvaliacoes: 20,
    localizacao: {
      endereco: 'Rua da Caatinga, 321',
      cidade: 'Salvador',
      estado: 'BA',
      cep: '40000-000',
      latitude: -12.9714,
      longitude: -38.5014
    }
  },
  {
    id: '5',
    user_id: 'user-5',
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    telefone: '(41) 98765-9876',
    whatsapp: '5541987659876',
    bio: 'Criador de Guaraipo e outras espécies do Sul.',
    endereco: 'Av. das Araucárias, 654',
    cidade: 'Curitiba',
    estado: 'PR',
    cep: '80000-000',
    latitude: -25.4284,
    longitude: -49.2733,
    status: ['venda', 'informacao'],
    verificado: true,
    avaliacao_media: 4.6,
    total_avaliacoes: 10,
    created_at: '2023-08-15T00:00:00Z',
    updated_at: '2023-08-15T00:00:00Z',
    especies: ['melipona-bicolor', 'melipona-quadrifasciata', 'melipona-mondury'],
    descricao: 'Criador de Guaraipo e outras espécies do Sul.',
    avaliacao: 4.6,
    totalAvaliacoes: 10,
    localizacao: {
      endereco: 'Av. das Araucárias, 654',
      cidade: 'Curitiba',
      estado: 'PR',
      cep: '80000-000',
      latitude: -25.4284,
      longitude: -49.2733
    }
  },
  {
    id: '6',
    user_id: 'user-6',
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    telefone: '(61) 99876-9876',
    whatsapp: '5561998769876',
    bio: 'Meliponicultora urbana, foco em educação ambiental.',
    endereco: 'Rua do Cerrado, 147',
    cidade: 'Brasília',
    estado: 'DF',
    cep: '70000-000',
    latitude: -15.7975,
    longitude: -47.8919,
    status: ['troca', 'informacao'],
    verificado: true,
    avaliacao_media: 4.9,
    total_avaliacoes: 6,
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2023-09-01T00:00:00Z',
    especies: ['melipona-rufiventris', 'tetragonisca-angustula'],
    descricao: 'Meliponicultora urbana, foco em educação ambiental.',
    avaliacao: 4.9,
    totalAvaliacoes: 6,
    localizacao: {
      endereco: 'Rua do Cerrado, 147',
      cidade: 'Brasília',
      estado: 'DF',
      cep: '70000-000',
      latitude: -15.7975,
      longitude: -47.8919
    }
  },
  {
    id: '7',
    user_id: 'user-7',
    nome: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    telefone: '(92) 98765-4567',
    whatsapp: '5592987654567',
    bio: 'Especialista em espécies amazônicas, Uruçu-boca-de-renda.',
    endereco: 'Rua da Amazônia, 852',
    cidade: 'Manaus',
    estado: 'AM',
    cep: '69000-000',
    latitude: -3.1190,
    longitude: -60.0217,
    status: ['venda', 'troca'],
    verificado: true,
    avaliacao_media: 4.8,
    total_avaliacoes: 14,
    created_at: '2022-07-20T00:00:00Z',
    updated_at: '2022-07-20T00:00:00Z',
    especies: ['melipona-seminigra', 'melipona-fasciculata'],
    descricao: 'Especialista em espécies amazônicas, Uruçu-boca-de-renda.',
    avaliacao: 4.8,
    totalAvaliacoes: 14,
    localizacao: {
      endereco: 'Rua da Amazônia, 852',
      cidade: 'Manaus',
      estado: 'AM',
      cep: '69000-000',
      latitude: -3.1190,
      longitude: -60.0217
    }
  },
  {
    id: '8',
    user_id: 'user-8',
    nome: 'Juliana Pereira',
    email: 'juliana.pereira@email.com',
    telefone: '(85) 99876-4567',
    whatsapp: '5585998764567',
    bio: 'Criadora de Jandaíra e outras espécies da Caatinga.',
    endereco: 'Av. do Nordeste, 963',
    cidade: 'Fortaleza',
    estado: 'CE',
    cep: '60000-000',
    latitude: -3.7327,
    longitude: -38.5270,
    status: ['venda', 'troca', 'informacao'],
    verificado: true,
    avaliacao_media: 4.7,
    total_avaliacoes: 9,
    created_at: '2023-04-12T00:00:00Z',
    updated_at: '2023-04-12T00:00:00Z',
    especies: ['melipona-subnitida', 'scaptotrigona-bipunctata', 'frieseomelitta-varia'],
    descricao: 'Criadora de Jandaíra e outras espécies da Caatinga.',
    avaliacao: 4.7,
    totalAvaliacoes: 9,
    localizacao: {
      endereco: 'Av. do Nordeste, 963',
      cidade: 'Fortaleza',
      estado: 'CE',
      cep: '60000-000',
      latitude: -3.7327,
      longitude: -38.5270
    }
  },
  {
    id: '9',
    user_id: 'user-9',
    nome: 'Marcos Souza',
    email: 'marcos.souza@email.com',
    telefone: '(48) 98765-7890',
    whatsapp: '5548987657890',
    bio: 'Meliponicultor de Santa Catarina, espécies do clima subtropical.',
    endereco: 'Rua do Pampa, 159',
    cidade: 'Florianópolis',
    estado: 'SC',
    cep: '88000-000',
    latitude: -27.5954,
    longitude: -48.5480,
    status: ['venda', 'informacao'],
    verificado: true,
    avaliacao_media: 4.5,
    total_avaliacoes: 7,
    created_at: '2023-10-05T00:00:00Z',
    updated_at: '2023-10-05T00:00:00Z',
    especies: ['melipona-bicolor', 'plebeia-remota', 'tetragonisca-angustula'],
    descricao: 'Meliponicultor de Santa Catarina, espécies do clima subtropical.',
    avaliacao: 4.5,
    totalAvaliacoes: 7,
    localizacao: {
      endereco: 'Rua do Pampa, 159',
      cidade: 'Florianópolis',
      estado: 'SC',
      cep: '88000-000',
      latitude: -27.5954,
      longitude: -48.5480
    }
  },
  {
    id: '10',
    user_id: 'user-10',
    nome: 'Luciana Ferreira',
    email: 'luciana.ferreira@email.com',
    telefone: '(51) 99876-7890',
    whatsapp: '5551998767890',
    bio: 'Criadora de Guaraipo no Rio Grande do Sul.',
    endereco: 'Av. Gaúcha, 357',
    cidade: 'Porto Alegre',
    estado: 'RS',
    cep: '90000-000',
    latitude: -30.0346,
    longitude: -51.2177,
    status: ['troca', 'informacao'],
    verificado: true,
    avaliacao_media: 4.8,
    total_avaliacoes: 11,
    created_at: '2023-02-28T00:00:00Z',
    updated_at: '2023-02-28T00:00:00Z',
    especies: ['melipona-bicolor', 'plebeia-remota'],
    descricao: 'Criadora de Guaraipo no Rio Grande do Sul.',
    avaliacao: 4.8,
    totalAvaliacoes: 11,
    localizacao: {
      endereco: 'Av. Gaúcha, 357',
      cidade: 'Porto Alegre',
      estado: 'RS',
      cep: '90000-000',
      latitude: -30.0346,
      longitude: -51.2177
    }
  }
];

// Estatísticas
export const estatisticasCriadores = {
  total: criadores.length,
  porEstado: criadores.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  verificados: criadores.filter(c => c.verificado).length,
  mediaAvaliacao: criadores.reduce((acc, c) => acc + c.avaliacao_media, 0) / criadores.length
};

// Função para filtrar criadores
export function filtrarCriadores(filtros: {
  especies?: string[];
  estados?: string[];
  status?: ('venda' | 'troca' | 'informacao')[];
}) {
  return criadores.filter(criador => {
    if (filtros.especies?.length && !criador.especies?.some(e => filtros.especies?.includes(e))) {
      return false;
    }
    if (filtros.estados?.length && !filtros.estados.includes(criador.estado)) {
      return false;
    }
    if (filtros.status?.length && !criador.status.some(s => filtros.status?.includes(s))) {
      return false;
    }
    return true;
  });
}
