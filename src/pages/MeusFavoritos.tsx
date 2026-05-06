import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Phone, ExternalLink, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavoritos } from '../hooks/useWhatsApp';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { criadores as mockCriadores } from '../data/criadores';

interface FavCriador {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  avaliacao_media: number;
  total_avaliacoes: number;
  verificado: boolean;
  telefone: string;
  avatar_url?: string;
  status: string[];
}

export function MeusFavoritos() {
  const { user } = useAuth();
  const { favoritos, carregarFavoritos, removerFavorito } = useFavoritos();
  const [criadores, setCriadores] = useState<FavCriador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Carregar favoritos do usuário
  useEffect(() => {
    if (user?.id) carregarFavoritos(user.id);
  }, [user?.id, carregarFavoritos]);

  // Buscar dados dos criadores favoritados
  useEffect(() => {
    const fetchCriadores = async () => {
      if (favoritos.length === 0) {
        setCriadores([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      if (!isSupabaseConfigured()) {
        // Modo offline: buscar nos dados mock
        const found = mockCriadores
          .filter(c => favoritos.includes(c.id))
          .map(c => ({
            id: c.id, nome: c.nome,
            cidade: c.localizacao?.cidade || c.cidade,
            estado: c.localizacao?.estado || c.estado,
            avaliacao_media: c.avaliacao ?? c.avaliacao_media ?? 0,
            total_avaliacoes: c.totalAvaliacoes ?? c.total_avaliacoes ?? 0,
            verificado: c.verificado, telefone: c.telefone,
            avatar_url: c.avatar_url, status: c.status,
          }));
        setCriadores(found);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('criadores')
          .select('id, nome, cidade, estado, avaliacao_media, total_avaliacoes, verificado, telefone, avatar_url, status')
          .in('id', favoritos);
        if (error) throw error;
        setCriadores((data || []) as FavCriador[]);
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriadores();
  }, [favoritos]);

  const filtered = search
    ? criadores.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cidade.toLowerCase().includes(search.toLowerCase()))
    : criadores;

  if (!user) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding py-16 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Faça login para ver seus favoritos</h2>
          <p className="text-[var(--asf-gray-medium)] mb-6">Você precisa estar logado para salvar e visualizar criadores favoritos.</p>
          <Link to="/entrar" className="inline-flex px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors">Entrar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      <div className="container-asf section-padding py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link to="/mapa" className="inline-flex items-center gap-1 text-sm text-[var(--asf-green)] hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Voltar ao mapa
            </Link>
            <h1 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" /> Meus Favoritos
            </h1>
            <p className="text-[var(--asf-gray-medium)] mt-1">{criadores.length} criador{criadores.length !== 1 ? 'es' : ''} salvo{criadores.length !== 1 ? 's' : ''}</p>
          </div>
          {criadores.length > 3 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar nos favoritos..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-2">
              {search ? 'Nenhum favorito encontrado' : 'Nenhum criador favoritado ainda'}
            </h3>
            <p className="text-[var(--asf-gray-medium)] mb-6">
              {search ? 'Tente outra busca.' : 'Explore o mapa e salve seus criadores favoritos clicando no coração.'}
            </p>
            {!search && <Link to="/mapa" className="inline-flex px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors text-sm">Explorar Mapa</Link>}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                      {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : <span className="font-bold text-[var(--asf-green)]">{c.nome.charAt(0)}</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-[var(--asf-gray-dark)]">{c.nome}</p>
                        {c.verificado && <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>}
                      </div>
                      <p className="text-sm text-[var(--asf-gray-medium)] flex items-center gap-1"><MapPin className="w-3 h-3" />{c.cidade}, {c.estado}</p>
                    </div>
                  </div>
                  <button onClick={() => removerFavorito(c.id, user?.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" title="Remover">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-[var(--asf-yellow)] text-[var(--asf-yellow)]" /><span className="font-medium">{(c.avaliacao_media || 0).toFixed(1)}</span><span className="text-[var(--asf-gray-medium)]">({c.total_avaliacoes || 0})</span></div>
                  <div className="flex gap-1">
                    {c.status?.map(s => (
                      <span key={s} className={`px-2 py-0.5 rounded-full text-xs ${s === 'venda' ? 'bg-green-100 text-green-700' : s === 'troca' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Info'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/perfil/${c.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Ver Perfil
                  </Link>
                  {c.telefone && (
                    <a href={`https://wa.me/${c.telefone.replace(/\D/g, '').replace(/^(\d{2})/, '55$1')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors">
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
