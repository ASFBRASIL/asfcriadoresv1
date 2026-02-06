import { useState, useEffect } from 'react';
import { Bell, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Notificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  created_at: string;
}

export function Notificacoes() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchNotificacoes = async () => {
      const { data } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setNotificacoes(data);
      setLoading(false);
    };

    fetchNotificacoes();
  }, [user]);

  const marcarComoLida = async (id: string) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const marcarTodasLidas = async () => {
    if (!user || !isSupabaseConfigured()) return;
    await supabase.from('notificacoes').update({ lida: true }).eq('user_id', user.id).eq('lida', false);
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to="/meu-perfil" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--asf-gray-dark)]" />
              </Link>
              <div>
                <h1 className="text-xl lg:text-2xl font-poppins font-bold text-[var(--asf-gray-dark)]">
                  Notificações
                </h1>
                {naoLidas > 0 && (
                  <p className="text-sm text-[var(--asf-gray-medium)]">{naoLidas} não lida(s)</p>
                )}
              </div>
            </div>
            {naoLidas > 0 && (
              <button
                onClick={marcarTodasLidas}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--asf-green)] hover:bg-[var(--asf-green)]/10 transition-colors"
              >
                <Check className="w-4 h-4" /> Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Lista de notificações */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" />
            </div>
          ) : notificacoes.length > 0 ? (
            <div className="space-y-2">
              {notificacoes.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.lida && marcarComoLida(notif.id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer ${
                    notif.lida
                      ? 'bg-white'
                      : 'bg-white border-l-4 border-l-[var(--asf-green)] shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notif.lida ? 'bg-gray-100' : 'bg-[var(--asf-green)]/10'
                    }`}>
                      <Bell className={`w-5 h-5 ${notif.lida ? 'text-gray-400' : 'text-[var(--asf-green)]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.lida ? 'text-[var(--asf-gray-medium)]' : 'font-medium text-[var(--asf-gray-dark)]'}`}>
                        {notif.titulo}
                      </p>
                      <p className="text-xs text-[var(--asf-gray-medium)] mt-1">{notif.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {!notif.lida && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--asf-green)] flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-[var(--asf-gray-medium)]">
                Você será notificado quando houver novidades na plataforma.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
