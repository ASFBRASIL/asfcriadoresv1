import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Processar o callback de autenticação OAuth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Verificar se o usuário já tem perfil de criador
        supabase
          .from('criadores')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: criador }) => {
            if (criador) {
              navigate('/');
            } else {
              // Criar perfil básico para usuários OAuth
              const nome = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
              const avatar = session.user.user_metadata?.avatar_url;
              
              supabase
                .from('criadores')
                .insert({
                  user_id: session.user.id,
                  nome,
                  email: session.user.email,
                  telefone: '',
                  whatsapp: '',
                  avatar_url: avatar,
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
                })
                .then(() => {
                  navigate('/');
                });
            }
          });
      } else {
        navigate('/entrar');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[var(--asf-green)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--asf-gray-medium)]">Processando login...</p>
      </div>
    </div>
  );
}
