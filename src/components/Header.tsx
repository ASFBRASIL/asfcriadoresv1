import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Heart, Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotificacoes } from '../hooks/useNotificacoes';
import { ThemeToggle } from './ThemeToggle';
import { buscarEspecies } from '../data/especies';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { criadores as mockCriadores } from '../data/criadores';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/mapa', label: 'Mapa' },
  { path: '/especies', label: 'Espécies' },
  { path: '/criadores', label: 'Criadores' },
  { path: '/sobre', label: 'Sobre' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, criador, signOut, isAdmin } = useAuth();
  const { naoLidas } = useNotificacoes(user?.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const [criadoresResults, setCriadoresResults] = useState<any[]>([]);

  // Buscar criadores no Supabase quando query muda
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setCriadoresResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase
          .from('criadores')
          .select('id, nome, cidade, estado')
          .or(`nome.ilike.%${searchQuery}%,cidade.ilike.%${searchQuery}%`)
          .limit(4);
        setCriadoresResults(data || []);
      } else {
        setCriadoresResults(
          mockCriadores.filter(c =>
            c.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.cidade.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 4)
        );
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Resultados de busca
  const searchResults = searchQuery.trim().length >= 2 ? {
    especies: buscarEspecies(searchQuery).slice(0, 4),
    criadores: criadoresResults,
  } : { especies: [], criadores: [] };

  const hasResults = searchResults.especies.length > 0 || searchResults.criadores.length > 0;

  // Fechar busca ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goSearch = (path: string) => { setSearchOpen(false); setSearchQuery(''); setIsMobileMenuOpen(false); navigate(path); };

  // Atalho global Ctrl+K / Cmd+K para abrir busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-asf section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/images/logo-asf.png" 
              alt="ASF Criadores" 
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <span className={`font-poppins font-bold text-lg lg:text-xl transition-colors duration-300 ${
              isScrolled ? 'text-[var(--asf-gray-dark)]' : 'text-[var(--asf-gray-dark)]'
            }`}>
              ASF Criadores
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-[var(--asf-green)] bg-[var(--asf-green)]/10'
                    : 'text-[var(--asf-gray-medium)] hover:text-[var(--asf-green)] hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          {/* Global Search */}
          <div className="hidden lg:block relative" ref={searchRef}>
            {searchOpen ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } if (e.key === 'Enter' && searchQuery.trim()) goSearch(`/mapa?q=${encodeURIComponent(searchQuery)}`); }}
                  placeholder="Buscar criadores, espécies..."
                  className="w-64 pl-10 pr-10 py-2 rounded-xl border border-gray-200 bg-white focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
                {/* Results dropdown */}
                {searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {hasResults ? (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.especies.length > 0 && (
                          <div className="p-2">
                            <p className="text-xs font-medium text-[var(--asf-gray-medium)] px-2 py-1">ESPÉCIES</p>
                            {searchResults.especies.map(e => (
                              <button key={e.id} onClick={() => goSearch(`/especie/${e.id}`)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left">
                                <div className="w-7 h-7 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center"><span className="text-xs">🐝</span></div>
                                <div><p className="text-sm font-medium">{e.nomesPopulares[0]}</p><p className="text-xs text-[var(--asf-gray-medium)] italic">{e.nomeCientifico}</p></div>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.criadores.length > 0 && (
                          <div className="p-2 border-t border-gray-100">
                            <p className="text-xs font-medium text-[var(--asf-gray-medium)] px-2 py-1">CRIADORES</p>
                            {searchResults.criadores.map(c => (
                              <button key={c.id} onClick={() => goSearch(`/perfil/${c.id}`)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left">
                                <div className="w-7 h-7 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center"><span className="text-xs font-bold text-[var(--asf-green)]">{c.nome.charAt(0)}</span></div>
                                <div><p className="text-sm font-medium">{c.nome}</p><p className="text-xs text-[var(--asf-gray-medium)]">{c.cidade}, {c.estado}</p></div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-[var(--asf-gray-medium)]">Nenhum resultado para "{searchQuery}"</div>
                    )}
                    <div className="border-t border-gray-100 p-2">
                      <button onClick={() => goSearch(`/mapa?q=${encodeURIComponent(searchQuery)}`)}
                        className="w-full px-3 py-2 rounded-lg text-sm text-[var(--asf-green)] hover:bg-[var(--asf-green)]/10 text-center">
                        Ver todos no mapa →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--asf-gray-medium)] hover:text-[var(--asf-green)] hover:bg-[var(--asf-green)]/10 transition-all border border-gray-200" title="Buscar (Ctrl+K)">
                <Search className="w-4 h-4" />
                <span className="text-xs text-gray-400">Buscar</span>
              </button>
            )}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/favoritos" className="p-2 rounded-xl text-[var(--asf-gray-medium)] hover:text-red-500 hover:bg-red-50 transition-all" title="Favoritos">
                  <Heart className="w-4.5 h-4.5" />
                </Link>
                <div className="relative">
                  <Link to="/notificacoes" className="p-2 rounded-xl text-[var(--asf-gray-medium)] hover:text-[var(--asf-green)] hover:bg-[var(--asf-green)]/10 transition-all" title="Notificações">
                    <Bell className="w-4.5 h-4.5" />
                    {naoLidas > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">{naoLidas > 9 ? '9+' : naoLidas}</span>}
                  </Link>
                </div>
                <Link
                  to={isAdmin ? "/dashboard" : "/meu-perfil"}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                           text-[var(--asf-gray-dark)] hover:bg-gray-100 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  {isAdmin ? 'Painel Admin' : (criador?.nome?.split(' ')[0] || 'Meu Perfil')}
                </Link>
                <button
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-gray-200 
                           text-[var(--asf-gray-medium)] hover:border-red-300 hover:text-red-600
                           transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sou-criador"
                  className="px-5 py-2.5 rounded-xl font-medium text-sm bg-[var(--asf-yellow)] 
                           text-[var(--asf-gray-dark)] hover:bg-[var(--asf-yellow-dark)] 
                           transition-all duration-300 hover:-translate-y-0.5"
                >
                  Sou Criador
                </Link>
                <Link
                  to="/entrar"
                  className="px-5 py-2.5 rounded-xl font-medium text-sm border-2 border-[var(--asf-green)] 
                           text-[var(--asf-green)] hover:bg-[var(--asf-green)] hover:text-white
                           transition-all duration-300"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Search + Menu Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setIsMobileMenuOpen(false); }}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center
                       text-[var(--asf-gray-dark)] hover:bg-gray-200 transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setSearchOpen(false); }}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center
                       text-[var(--asf-gray-dark)] hover:bg-gray-200 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50" ref={searchRef}>
          <div className="section-padding py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } if (e.key === 'Enter' && searchQuery.trim()) goSearch(`/mapa?q=${encodeURIComponent(searchQuery)}`); }}
                placeholder="Buscar criadores, espécies..."
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Mobile search results */}
            {searchQuery.trim().length >= 2 && (
              <div className="mt-2 bg-white rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
                {hasResults ? (
                  <div>
                    {searchResults.especies.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-[var(--asf-gray-medium)] px-2 py-1">ESPÉCIES</p>
                        {searchResults.especies.map(e => (
                          <button key={e.id} onClick={() => goSearch(`/especie/${e.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-left">
                            <span className="text-sm">🐝</span>
                            <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{e.nomesPopulares[0]}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.criadores.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <p className="text-xs font-medium text-[var(--asf-gray-medium)] px-2 py-1">CRIADORES</p>
                        {searchResults.criadores.map(c => (
                          <button key={c.id} onClick={() => goSearch(`/perfil/${c.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-left">
                            <div className="w-7 h-7 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-[var(--asf-green)]">{c.nome.charAt(0)}</span></div>
                            <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{c.nome}</p><p className="text-xs text-[var(--asf-gray-medium)] truncate">{c.cidade}, {c.estado}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-[var(--asf-gray-medium)]">Nenhum resultado</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg
                   transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="section-padding py-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <span className="text-sm text-[var(--asf-gray-medium)]">Tema</span>
            <ThemeToggle />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-[var(--asf-green)] bg-[var(--asf-green)]/10'
                  : 'text-[var(--asf-gray-medium)] hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
            {user ? (
              <>
                <div className="flex gap-2 mb-1">
                  <Link
                    to="/favoritos"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm
                             bg-red-50 text-red-500 min-h-[44px]"
                  >
                    <Heart className="w-4 h-4" /> Favoritos
                  </Link>
                  <Link
                    to="/notificacoes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm
                             bg-[var(--asf-green)]/10 text-[var(--asf-green)] min-h-[44px] relative"
                  >
                    <Bell className="w-4 h-4" /> Notificações
                    {naoLidas > 0 && (
                      <span className="absolute top-2 right-3 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                        {naoLidas > 9 ? '9+' : naoLidas}
                      </span>
                    )}
                  </Link>
                </div>
                <Link
                  to={isAdmin ? "/dashboard" : "/meu-perfil"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-center bg-[var(--asf-yellow)]
                           text-[var(--asf-gray-dark)] min-h-[44px] flex items-center justify-center"
                >
                  {isAdmin ? 'Painel Admin' : 'Meu Perfil'}
                </Link>
                <button
                  onClick={async () => { setIsMobileMenuOpen(false); await signOut(); navigate('/'); }}
                  className="px-4 py-3 rounded-xl font-medium text-center border-2 border-gray-200
                           text-[var(--asf-gray-medium)] min-h-[44px]"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sou-criador"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-center bg-[var(--asf-yellow)] 
                           text-[var(--asf-gray-dark)]"
                >
                  Sou Criador
                </Link>
                <Link
                  to="/entrar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-center border-2 border-[var(--asf-green)] 
                           text-[var(--asf-green)]"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
