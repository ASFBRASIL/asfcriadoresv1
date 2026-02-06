import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Criador, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  criador: Criador | null;
  isLoading: boolean;
  isCriadorLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, nome: string, telefone: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshCriador: () => Promise<void>;
  isSupabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criador mockado para modo offline
const mockCriador: Criador = {
  id: 'mock-1',
  user_id: 'mock-user',
  nome: 'Criador Demo',
  email: 'demo@asfcriadores.com',
  telefone: '(11) 99999-9999',
  whatsapp: '5511999999999',
  avatar_url: undefined,
  bio: 'Criador de abelhas sem ferrão apaixonado pela natureza.',
  endereco: 'Rua das Flores, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01000-000',
  latitude: -23.5505,
  longitude: -46.6333,
  status: ['venda', 'troca', 'informacao'],
  verificado: true,
  avaliacao_media: 4.8,
  total_avaliacoes: 12,
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [criador, setCriador] = useState<Criador | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCriadorLoading, setIsCriadorLoading] = useState(false);
  const [supabaseReady] = useState(isSupabaseConfigured());

  // Buscar dados do criador
  const fetchCriador = async (userId: string) => {
    if (!supabaseReady) {
      setCriador(mockCriador);
      return;
    }

    setIsCriadorLoading(true);
    try {
      const { data, error } = await supabase
        .from('criadores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('Criador não encontrado:', error.message);
        setCriador(null);
      } else {
        setCriador(data as Criador);
      }
    } catch (error) {
      console.error('Erro ao buscar criador:', error);
      setCriador(null);
    } finally {
      setIsCriadorLoading(false);
    }
  };

  useEffect(() => {
    if (!supabaseReady) {
      // Modo offline - não tentar conectar ao Supabase
      setIsLoading(false);
      return;
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCriador(session.user.id);
      }
      setIsLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCriador(session.user.id);
      } else {
        setCriador(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseReady]);

  const signUp = async (email: string, password: string, nome: string, telefone: string) => {
    if (!supabaseReady) {
      // Modo offline - simular sucesso
      setUser({ id: 'mock-user', email } as User);
      setCriador({ ...mockCriador, nome, email, telefone });
      return { error: null };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
          },
        },
      });

      if (authError) throw authError;

      // Criar registro na tabela criadores
      if (authData.user) {
        const { error: criadorError } = await supabase.from('criadores').insert({
          user_id: authData.user.id,
          nome,
          email,
          telefone,
          whatsapp: telefone.replace(/\D/g, ''),
          endereco: '',
          cidade: '',
          estado: '',
          cep: '',
          latitude: 0,
          longitude: 0,
          status: ['informacao'],
          verificado: false,
          avaliacao_media: 0,
          total_avaliacoes: 0,
        });

        if (criadorError) throw criadorError;
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseReady) {
      // Modo offline - simular login
      if (email === 'demo@asfcriadores.com' && password === 'demo123') {
        setUser({ id: 'mock-user', email } as User);
        setCriador(mockCriador);
        return { error: null };
      }
      return { error: new Error('Credenciais inválidas') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    if (!supabaseReady) {
      alert('Login com Google disponível apenas com Supabase configurado');
      return { error: new Error('Supabase não configurado') };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!supabaseReady) {
      setUser(null);
      setCriador(null);
      return;
    }
    await supabase.auth.signOut();
    setCriador(null);
  };

  const resetPassword = async (email: string) => {
    if (!supabaseReady) {
      return { error: new Error('Recuperação de senha requer Supabase configurado.') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/entrar`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshCriador = async () => {
    if (user) {
      await fetchCriador(user.id);
    }
  };

  const isAdmin = criador?.role === 'admin' || criador?.role === 'moderador' || false;

  const value: AuthContextType = {
    user,
    session,
    criador,
    isLoading,
    isCriadorLoading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshCriador,
    isSupabaseReady: supabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
