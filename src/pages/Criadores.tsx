import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Star, Filter, ChevronDown, Check, X,
  Heart, Phone, Users, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavoritos } from '../hooks/useWhatsApp';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { criadores as mockCriadores } from '../data/criadores';
import { estados } from '../data/estados';
import { getTodasEspeciesParaFiltro } from '../data/especies';
import { useSEO } from '../hooks/useSEO';
import { usePagination, PaginationControls } from '../hooks/usePagination';
import { Skeleton } from '../components/ui/skeleton';

export function Criadores() {
  const { user } = useAuth();
  const { isFavorito, adicionarFavorito, removerFavorito, carregarFavoritos } = useFavoritos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [selectedEspecies, setSelectedEspecies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [criadores, setCriadores] = useState<any[]>([]);
  const [totalCriadores, setTotalCriadores] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useSEO({
    title: 'Criadores de Abelhas Sem Ferrão',
    description: 'Conheça os criadores de abelhas sem ferrão cadastrados na plataforma ASF Criadores. Encontre meliponicultores perto de você.',
  });

  const todasEspecies = getTodasEspeciesParaFiltro();

  // Carregar favoritos
  useEffect(() => {
    if (user?.id) carregarFavoritos(user.id);
  }, [user?.id, carregarFavoritos]);

  // Buscar criadores
  useEffect(() => {
    let cancelled = false;

    const fetchCriadores = async () => {
      setIsLoading(true);

      if (!isSupabaseConfigured()) {
        let filtered = [...mockCriadores];
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(c =>
            c.nome.toLowerCase().includes(q) || c.cidade.toLowerCase().includes(q)
          );
        }
        if (selectedEstados.length > 0) {
          filtered = filtered.filter(c => selectedEstados.includes(c.estado));
        }
        if (!cancelled) {
          setCriadores(filtered);
          setTotalCriadores(mockCriadores.length);
          setIsLoading(false);
        }
        return;
      }

      try {
        let query = supabase.from('criadores').select('*');

        if (searchTerm.trim()) {
          query = query.or(`nome.ilike.%${searchTerm}%,cidade.ilike.%${searchTerm}%`);
        }
        if (selectedEstados.length > 0) {
          query = query.in('estado', selectedEstados);
        }

        const { data, error } = await query.order('avaliacao_media', { ascending: false });

        if (error) throw error;

        if (!cancelled) {
          let result = data || [];

          // Filtro por espécies requer subquery
          if (selectedEspecies.length > 0) {
            const { data: ceData } = await supabase
              .from('criador_especies')
              .select('criador_id')
              .in('especie_id', selectedEspecies);
            if (ceData) {
              const ids = new Set(ceData.map(ce => ce.criador_id));
              result = result.filter(c => ids.has(c.id));
            }
          }

          setCriadores(result);
          // Total sem filtros
          if (!searchTerm && selectedEstados.length === 0 && selectedEspecies.length === 0) {
            setTotalCriadores(result.length);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar criadores:', err);
        if (!cancelled) {
          setCriadores(mockCriadores);
          setTotalCriadores(mockCriadores.length);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchCriadores, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchTerm, selectedEstados, selectedEspecies]);

  // Fetch total on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setTotalCriadores(mockCriadores.length);
      return;
    }
    supabase.from('criadores').select('*', { count: 'exact', head: true }).then(({ count }) => {
      if (count !== null) setTotalCriadores(count);
    });
  }, []);

  const toggleEstado = (sigla: string) => {
    setSelectedEstados(prev =>
      prev.includes(sigla) ? prev.filter(e => e !== sigla) : [...prev, sigla]
    );
  };

  const toggleEspecie = (id: string) => {
    setSelectedEspecies(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedEstados([]);
    setSelectedEspecies([]);
    setSearchTerm('');
  };

  const activeFilterCount = selectedEstados.length + selectedEspecies.length;
  const pagination = usePagination(criadores, 12);
  const getAvaliacao = (c: any) => {
    const val = c.avaliacao ?? c.avaliacao_media ?? 0;
    return typeof val === 'string' ? parseFloat(val) : val;
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[var(--asf-gray-light)]">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)] text-white">
        <div className="container-asf section-padding py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-poppins font-bold">
                  Criadores
                </h1>
              </div>
              <p className="text-white/80 max-w-xl">
                Conheça os meliponicultores cadastrados na plataforma. Encontre criadores perto de você e conecte-se com a comunidade.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalCriadores}</div>
                <div className="text-white/70 text-sm">criadores cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">27</div>
                <div className="text-white/70 text-sm">estados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-20">
        <div className="container-asf section-padding py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                         focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20
                         transition-all outline-none text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeFilterCount > 0
                  ? 'bg-[var(--asf-green)] text-white'
                  : 'bg-gray-100 text-[var(--asf-gray-dark)] hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-xs">{activeFilterCount}</span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fade-in">
              {/* Active filters chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedEstados.map(uf => (
                    <span key={uf} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      {uf}
                      <button onClick={() => toggleEstado(uf)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedEspecies.map(id => {
                    const esp = todasEspecies.find(e => e.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs font-medium">
                        {esp?.nome || id}
                        <button onClick={() => toggleEspecie(id)}><X className="w-3 h-3" /></button>
                      </span>
                    );
                  })}
                  <button onClick={clearFilters} className="text-xs text-[var(--asf-gray-medium)] hover:text-[var(--asf-green)] underline">
                    Limpar todos
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Estados */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2">Estado</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                    {estados.map(uf => (
                      <button key={uf.sigla} onClick={() => toggleEstado(uf.sigla)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-left transition-colors ${
                          selectedEstados.includes(uf.sigla)
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedEstados.includes(uf.sigla) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedEstados.includes(uf.sigla) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium">{uf.sigla}</span>
                        <span className="text-[var(--asf-gray-medium)]">- {uf.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Espécies */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2">Espécies</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                    {todasEspecies.map(esp => (
                      <button key={esp.id} onClick={() => toggleEspecie(esp.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-left transition-colors ${
                          selectedEspecies.includes(esp.id)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedEspecies.includes(esp.id) ? 'bg-[var(--asf-green)] border-[var(--asf-green)]' : 'border-gray-300'
                        }`}>
                          {selectedEspecies.includes(esp.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="truncate">{esp.nome}</span>
                        <span className="text-xs text-[var(--asf-gray-medium)] italic ml-auto">
                          {esp.nomeCientifico.split(' ')[0]}.
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-asf section-padding py-6">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--asf-gray-medium)]">
            {isLoading ? 'Buscando...' : `${criadores.length} criador${criadores.length !== 1 ? 'es' : ''} encontrado${criadores.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full mt-3" />
                </div>
                <div className="px-5 pb-3 flex gap-1.5">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="px-5 pb-5 flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-xl" />
                  <Skeleton className="h-10 w-11 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : criadores.length > 0 ? (
          <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagination.items.map((criador) => (
              <div key={criador.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Card Header */}
                <Link to={`/perfil/${criador.id}`} className="block p-5 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {criador.avatar_url ? (
                        <img src={criador.avatar_url} alt={criador.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-[var(--asf-green)]">
                          {criador.nome.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] truncate group-hover:text-[var(--asf-green)] transition-colors">
                          {criador.nome}
                        </h3>
                        {criador.verificado && (
                          <span className="px-1.5 py-0.5 rounded bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs flex-shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[var(--asf-gray-medium)] mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {criador.cidade || 'Cidade não informada'}{criador.estado ? `, ${criador.estado}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3.5 h-3.5 fill-[var(--asf-yellow)] text-[var(--asf-yellow)]" />
                        <span className="text-sm font-medium text-[var(--asf-gray-dark)]">
                          {getAvaliacao(criador).toFixed(1)}
                        </span>
                        <span className="text-xs text-[var(--asf-gray-medium)]">
                          ({criador.total_avaliacoes || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {criador.bio && (
                    <p className="text-sm text-[var(--asf-gray-medium)] mt-3 line-clamp-2">
                      {criador.bio}
                    </p>
                  )}
                </Link>

                {/* Status tags */}
                <div className="px-5 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(criador.status || []).map((s: string) => (
                      <span key={s} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s === 'venda' ? 'bg-green-100 text-green-700' :
                        s === 'troca' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Informação'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex items-center gap-2">
                  <Link
                    to={`/perfil/${criador.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                             bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)]
                             transition-colors"
                  >
                    Ver Perfil
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  {criador.whatsapp && (
                    <a
                      href={`https://wa.me/${criador.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                               bg-green-500 text-white text-sm font-medium hover:bg-green-600
                               transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {user && (
                    <button
                      onClick={() => isFavorito(criador.id) ? removerFavorito(criador.id, user.id) : adicionarFavorito(criador.id, user.id)}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
                        isFavorito(criador.id)
                          ? 'bg-red-100 text-red-500'
                          : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorito(criador.id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <PaginationControls {...pagination} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-300 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-2">
              Nenhum criador encontrado
            </h3>
            <p className="text-[var(--asf-gray-medium)] dark:text-gray-400 mb-4">
              Tente ajustar os filtros ou buscar por outro nome/cidade.
            </p>
            <button onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] transition-colors">
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
