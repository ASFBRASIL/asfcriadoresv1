# 🐝 ASF Criadores v2

Plataforma para conectar criadores de abelhas sem ferrão (meliponicultores) em todo o Brasil. Permite encontrar criadores por localização, filtrar por espécies, visualizar no mapa interativo e entrar em contato via WhatsApp.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Supabase · Leaflet

---

## 📋 Pré-requisitos

- **Node.js** 18+ (recomendado: 20 LTS)
- **npm** 9+ (vem com o Node)
- **Conta no Supabase** (gratuita) — opcional, o projeto roda em modo offline com dados mockados

## 🚀 Instalação Rápida

```bash
# 1. Clonar o repositório
git clone https://github.com/ASFBRASIL/asfcriadoresv2.git
cd asfcriadoresv2

# 2. Instalar dependências
npm install

# 3. Copiar variáveis de ambiente
cp .env.example .env

# 4. Rodar em modo desenvolvimento
npm run dev
```

O projeto vai abrir em `http://localhost:5173`. Sem configurar o Supabase, ele funciona em **modo offline** com dados de exemplo.

## ⚙️ Configuração do Supabase (dados reais)

Para funcionar com dados reais, você precisa configurar o Supabase:

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project**
3. Escolha um nome (ex: `asf-criadores`), senha e região (South America - São Paulo)
4. Aguarde a criação do projeto

### 2. Criar as tabelas

No **SQL Editor** do Supabase, execute o seguinte SQL:

```sql
-- Tabela de criadores
CREATE TABLE criadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT,
  endereco TEXT NOT NULL DEFAULT '',
  cidade TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT '',
  cep TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT[] NOT NULL DEFAULT ARRAY['informacao'],
  verificado BOOLEAN NOT NULL DEFAULT false,
  avaliacao_media DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_avaliacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de espécies
CREATE TABLE especies (
  id TEXT PRIMARY KEY,
  nome_cientifico TEXT NOT NULL,
  nomes_populares TEXT[] NOT NULL DEFAULT '{}',
  familia TEXT NOT NULL DEFAULT 'Apidae',
  tamanho TEXT NOT NULL DEFAULT 'média',
  producao_mel TEXT NOT NULL DEFAULT 'média',
  distribuicao TEXT[] NOT NULL DEFAULT '{}',
  biomas TEXT[] NOT NULL DEFAULT '{}',
  caracteristicas TEXT[] NOT NULL DEFAULT '{}',
  comportamento TEXT NOT NULL DEFAULT '',
  mel_descricao TEXT NOT NULL DEFAULT '',
  mel_propriedades TEXT[] NOT NULL DEFAULT '{}',
  mel_sabor TEXT NOT NULL DEFAULT '',
  manejo_dificuldade TEXT NOT NULL DEFAULT 'intermediário',
  manejo_caixa TEXT NOT NULL DEFAULT '',
  manejo_temperamento TEXT NOT NULL DEFAULT '',
  manejo_cuidados TEXT[] NOT NULL DEFAULT '{}',
  conservacao_status TEXT NOT NULL DEFAULT 'comum',
  conservacao_ameacas TEXT[] NOT NULL DEFAULT '{}',
  imagem_url TEXT,
  fontes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de relação criador-espécies
CREATE TABLE criador_especies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  criador_id UUID NOT NULL REFERENCES criadores(id) ON DELETE CASCADE,
  especie_id TEXT NOT NULL REFERENCES especies(id) ON DELETE CASCADE,
  quantidade INTEGER,
  preco DECIMAL(10,2),
  disponivel BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(criador_id, especie_id)
);

-- Tabela de avaliações
CREATE TABLE avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  criador_id UUID NOT NULL REFERENCES criadores(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  autor_nome TEXT NOT NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de favoritos
CREATE TABLE favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criador_id UUID NOT NULL REFERENCES criadores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, criador_id)
);

-- Tabela de contatos/mensagens
CREATE TABLE contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  remetente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destinatario_id UUID NOT NULL REFERENCES criadores(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  lido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_criadores_estado ON criadores(estado);
CREATE INDEX idx_criadores_user_id ON criadores(user_id);
CREATE INDEX idx_criador_especies_criador ON criador_especies(criador_id);
CREATE INDEX idx_criador_especies_especie ON criador_especies(especie_id);
CREATE INDEX idx_avaliacoes_criador ON avaliacoes(criador_id);

-- Habilitar Row Level Security
ALTER TABLE criadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE especies ENABLE ROW LEVEL SECURITY;
ALTER TABLE criador_especies ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (RLS)
-- Criadores: leitura pública, edição apenas pelo dono
CREATE POLICY "Criadores visíveis para todos" ON criadores FOR SELECT USING (true);
CREATE POLICY "Criador edita próprio perfil" ON criadores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário autenticado cria criador" ON criadores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Espécies: leitura pública
CREATE POLICY "Espécies visíveis para todos" ON especies FOR SELECT USING (true);

-- Criador_especies: leitura pública
CREATE POLICY "Criador_especies visíveis para todos" ON criador_especies FOR SELECT USING (true);

-- Avaliações: leitura pública, criação por autenticados
CREATE POLICY "Avaliações visíveis para todos" ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "Usuário autenticado cria avaliação" ON avaliacoes FOR INSERT WITH CHECK (auth.uid() = autor_id);

-- Favoritos: acesso apenas pelo próprio usuário
CREATE POLICY "Favoritos do próprio usuário" ON favoritos FOR ALL USING (auth.uid() = usuario_id);

-- Contatos: leitura pelo remetente ou destinatário
CREATE POLICY "Contatos do próprio usuário" ON contatos FOR SELECT
  USING (auth.uid() = remetente_id OR auth.uid() IN (SELECT user_id FROM criadores WHERE id = destinatario_id));
CREATE POLICY "Usuário autenticado envia contato" ON contatos FOR INSERT WITH CHECK (auth.uid() = remetente_id);
```

### 3. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication > Providers**
2. **Email** já vem habilitado por padrão
3. Para **Google OAuth** (opcional):
   - Vá em **Authentication > Providers > Google**
   - Habilite e configure com Client ID/Secret do Google Cloud Console
   - Adicione `https://seu-dominio.com/auth/callback` como redirect URI

### 4. Obter credenciais

1. No Supabase, vá em **Settings > API**
2. Copie o **Project URL** e a **anon public key**
3. Cole no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 5. Configurar Storage (avatares)

1. No Supabase, vá em **Storage**
2. Crie um bucket chamado `criadores`
3. Marque como **público**
4. Adicione a política: permitir upload para usuários autenticados

## 🏗️ Deploy

### Netlify (recomendado)

1. Conecte o repositório GitHub ao Netlify
2. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) em **Site settings > Environment variables**
4. O arquivo `public/_redirects` já está configurado para SPA routing

### Vercel

```bash
npm i -g vercel
vercel
```

Configure as mesmas variáveis de ambiente no painel da Vercel.

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis (Header, Footer, UI)
│   ├── Header.tsx     # Navegação principal (auth-aware)
│   ├── Footer.tsx     # Rodapé com links
│   ├── ProtectedRoute.tsx  # Guard de rotas autenticadas
│   └── ui/            # Componentes shadcn/ui
├── contexts/
│   └── AuthContext.tsx # Contexto de autenticação (Supabase Auth)
├── data/
│   ├── criadores.ts   # Dados mockados de criadores
│   ├── especies.ts    # Catálogo de espécies de abelhas
│   └── estados.ts     # Lista de estados brasileiros
├── hooks/
│   ├── useCriadores.ts   # CRUD de criadores (Supabase ou mock)
│   ├── useEspecies.ts    # Busca de espécies
│   ├── useAvaliacoes.ts  # Sistema de avaliações
│   ├── useDashboard.ts   # Estatísticas administrativas
│   └── useWhatsApp.ts    # Integração WhatsApp + favoritos
├── lib/
│   ├── supabase.ts    # Cliente Supabase + tipos do banco
│   └── utils.ts       # Utilitários (cn, etc)
├── pages/
│   ├── Home.tsx       # Landing page com hero, stats, features
│   ├── Mapa.tsx       # Mapa interativo com Leaflet
│   ├── Especies.tsx   # Catálogo de espécies com filtros
│   ├── Sobre.tsx      # Página institucional
│   ├── SouCriador.tsx # Cadastro de novos criadores
│   ├── Entrar.tsx     # Login (email/senha + Google)
│   ├── PerfilCriador.tsx  # Perfil público do criador
│   ├── Dashboard.tsx  # Painel administrativo
│   ├── AuthCallback.tsx   # Callback OAuth
│   └── NotFound.tsx   # Página 404
├── App.tsx            # Rotas da aplicação
├── main.tsx           # Entry point
└── index.css          # Estilos globais + variáveis CSS
```

## 🧪 Modo Offline / Demo

Sem configurar o Supabase, o projeto funciona com dados mockados:

- **Login demo:** `demo@asfcriadores.com` / `demo123`
- Todos os criadores, espécies e avaliações são dados de exemplo
- Funcionalidades de escrita (cadastro, avaliações) simulam sucesso

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificar código com ESLint |

## 🛠️ Tecnologias

- **React 19** + **TypeScript** — UI e tipagem
- **Vite 7** — Build tool
- **Tailwind CSS 3** — Estilização
- **Supabase** — Backend (auth, database, storage)
- **Leaflet** + **react-leaflet** — Mapa interativo
- **Framer Motion** — Animações
- **shadcn/ui** + **Radix UI** — Componentes de interface
- **Embla Carousel** — Carrossel na home
- **Zod** + **React Hook Form** — Validação de formulários

## 📄 Licença

Projeto da ASF Brasil — Associação de criadores de abelhas sem ferrão.
