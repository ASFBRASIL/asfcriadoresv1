import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  MapPin, Phone, Star, Edit2, Camera, Save, X,
  Leaf, Check, MessageCircle, Share2, Heart, Search
} from 'lucide-react';
// import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCriador, useUpdateCriador, useUploadAvatar } from '../hooks/useCriadores';
import { useAvaliacoes } from '../hooks/useAvaliacoes';
import { useWhatsApp, useFavoritos } from '../hooks/useWhatsApp';
import { estados } from '../data/estados';
import { especies as allEspeciesMock, buscarEspecies } from '../data/especies';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

// Componente gerenciador de espécies do criador
function EspecieManager({ criadorId, currentEspecies, onClose, onUpdate }: {
  criadorId: string; currentEspecies: any[]; onClose: () => void; onUpdate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(currentEspecies.map(e => e.id)));
  const [saving, setSaving] = useState(false);
  const [allDbEspecies, setAllDbEspecies] = useState<any[]>([]);

  // Carregar todas as espécies do Supabase ao abrir
  useEffect(() => {
    const loadAll = async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.from('especies').select('*').order('nome_cientifico');
        if (data) setAllDbEspecies(data);
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const q = search.toLowerCase();

    if (isSupabaseConfigured() && allDbEspecies.length > 0) {
      const found = allDbEspecies.filter(e =>
        e.nome_cientifico?.toLowerCase().includes(q) ||
        (e.nomes_populares || []).some((n: string) => n.toLowerCase().includes(q))
      ).slice(0, 8);
      setResults(found);
    } else {
      const found = buscarEspecies(search).slice(0, 8);
      setResults(found);
    }
  }, [search, allDbEspecies]);

  // Sempre usar UUID do banco
  const getEspecieId = (esp: any) => {
    if (esp.id && esp.id.length === 36 && esp.id.includes('-')) return esp.id;
    if (allDbEspecies.length > 0) {
      const found = allDbEspecies.find(e => e.slug === (esp.id || esp.slug) || e.id === esp.id);
      if (found) return found.id;
    }
    return esp.id || esp.slug;
  };

  const toggle = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  // Resolver slug para UUID
  const resolveToUuid = (espId: string): string | null => {
    if (espId.length === 36 && espId.includes('-')) return espId;
    const found = allDbEspecies.find(e => e.slug === espId);
    return found ? found.id : null;
  };

  const handleSave = async () => {
    setSaving(true);
    if (isSupabaseConfigured()) {
      const uuids = Array.from(selected)
        .map(id => resolveToUuid(id))
        .filter((id): id is string => id !== null);

      if (uuids.length > 0) {
        const rows = uuids.map(espId => ({ criador_id: criadorId, especie_id: espId, disponivel: true }));
        await supabase.from('criador_especies').delete().eq('criador_id', criadorId);
        const { error } = await supabase.from('criador_especies').insert(rows);
        if (error) console.error('Erro ao salvar espécies:', error);
      } else {
        await supabase.from('criador_especies').delete().eq('criador_id', criadorId);
      }
    }
    setSaving(false);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-poppins font-semibold text-lg">Gerenciar Espécies</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        {/* Espécies já selecionadas */}
        {selected.size > 0 && (
          <div className="mb-4">
            <p className="text-sm text-[var(--asf-gray-medium)] mb-2">{selected.size} espécie(s) selecionada(s):</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(selected).map(id => {
                const esp = allDbEspecies.find(e => e.id === id || e.slug === id) || allEspeciesMock.find(e => e.id === id) || currentEspecies.find(e => e.id === id);
                const nome = esp?.nomesPopulares?.[0] || esp?.nomes_populares?.[0] || esp?.nomeCientifico || esp?.nome_cientifico || id;
                return esp ? (
                  <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-sm">
                    <Leaf className="w-3 h-3" />{nome}
                    <button onClick={() => toggle(id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar espécie por nome..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" />
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-1 mb-4 max-h-60 overflow-y-auto">
            {results.map(esp => {
              const espId = getEspecieId(esp);
              const isSelected = selected.has(espId);
              return (
                <button key={espId} onClick={() => toggle(espId)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-[var(--asf-green)]/10 border border-[var(--asf-green)]/30' : 'hover:bg-gray-50 border border-transparent'}`}>
                  <div className="w-9 h-9 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-[var(--asf-green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--asf-gray-dark)] truncate">{esp.nomesPopulares?.[0] || esp.nomes_populares?.[0] || esp.nome_cientifico}</p>
                    <p className="text-xs text-[var(--asf-gray-medium)] italic truncate">{esp.nomeCientifico || esp.nome_cientifico}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[var(--asf-green)]" />}
                </button>
              );
            })}
          </div>
        )}

        {search && results.length === 0 && <p className="text-sm text-[var(--asf-gray-medium)] text-center py-4">Nenhuma espécie encontrada.</p>}
        {!search && <p className="text-sm text-[var(--asf-gray-medium)] text-center py-4">Digite o nome de uma espécie para buscar.</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-gray-100 font-medium text-sm">Cancelar</button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white font-medium text-sm hover:bg-[var(--asf-green-dark)] disabled:opacity-50 flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Estrelas para avaliação
function StarRating({ rating, max = 5, size = 'md', interactive = false, onRate }: {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (nota: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = interactive 
          ? (hoverRating || rating) >= starValue
          : rating >= starValue;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star 
              className={`${sizeClasses[size]} ${isFilled ? 'fill-[var(--asf-yellow)] text-[var(--asf-yellow)]' : 'text-gray-300'}`} 
            />
          </button>
        );
      })}
    </div>
  );
}

export function PerfilCriador() {
  const { id } = useParams<{ id: string }>();
  const { user, criador: criadorLogado } = useAuth();
  const { criador, especies, isLoading } = useCriador(id || null);
  useSEO({ title: criador ? `${criador.nome} - Criador` : 'Perfil do Criador', description: criador ? `Conheça ${criador.nome}, meliponicultor de ${criador.cidade || ''}, ${criador.estado || ''}. Veja espécies, avaliações e entre em contato.` : undefined, type: 'profile' });
  const { avaliacoes, media, total, adicionarAvaliacao } = useAvaliacoes(id || null);
  const { updateCriador, isLoading: isUpdating } = useUpdateCriador();
  const { uploadAvatar, isLoading: isUploading } = useUploadAvatar();
  const { abrirWhatsApp, getMensagemTemplate, compartilharPerfil } = useWhatsApp();
  const { isFavorito, adicionarFavorito, removerFavorito, carregarFavoritos } = useFavoritos();
  
  useEffect(() => { if (user?.id) carregarFavoritos(user.id); }, [user?.id, carregarFavoritos]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedCriador, setEditedCriador] = useState<any>({});
  const [novaAvaliacao, setNovaAvaliacao] = useState({ nota: 0, comentario: '' });
  const [mostrarFormAvaliacao, setMostrarFormAvaliacao] = useState(false);
  const [showEspecieManager, setShowEspecieManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = criadorLogado?.id === id;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!criador) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--asf-gray-dark)] mb-2">
            Criador não encontrado
          </h2>
          <Link to="/mapa" className="text-[var(--asf-green)] hover:underline">
            Voltar para o mapa
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!criador || !editedCriador) return;
    const { error } = await updateCriador(criador.id, editedCriador as any);
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !criador || !user) return;

    const url = await uploadAvatar(file, user.id);
    if (url) {
      await updateCriador(criador.id, { avatar_url: url });
    }
  };

  const handleAvaliar = async () => {
    if (!criador || !user || !criadorLogado) return;
    
    const { error } = await adicionarAvaliacao(
      criador.id,
      user.id,
      criadorLogado.nome,
      novaAvaliacao.nota,
      novaAvaliacao.comentario
    );

    if (!error) {
      setMostrarFormAvaliacao(false);
      setNovaAvaliacao({ nota: 0, comentario: '' });
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[var(--asf-gray-light)]">
      {/* Header do Perfil */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-[var(--asf-green)]/10 flex items-center justify-center overflow-hidden">
                {criador.avatar_url ? (
                  <img 
                    src={criador.avatar_url} 
                    alt={criador.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl lg:text-5xl font-bold text-[var(--asf-green)]">
                    {criador.nome.charAt(0)}
                  </span>
                )}
              </div>
              
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--asf-green)] 
                             text-white flex items-center justify-center hover:bg-[var(--asf-green-dark)] 
                             transition-colors shadow-lg"
                    disabled={isUploading}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h1 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)]">
                  {criador.nome}
                </h1>
                {criador.verificado && (
                  <span className="px-2 py-1 rounded-full bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Verificado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[var(--asf-gray-medium)] mb-4">
                <MapPin className="w-4 h-4" />
                <span>{criador.cidade}, {criador.estado}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={media} />
                  <span className="font-semibold text-[var(--asf-gray-dark)]">{media.toFixed(1)}</span>
                  <span className="text-[var(--asf-gray-medium)]">({total} avaliações)</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-3">
                {!isOwnProfile && (
                  <>
                    <button
                      onClick={() => abrirWhatsApp(criador.whatsapp, getMensagemTemplate('primeiro_contato', { nomeCriador: criador.nome }))}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 
                               text-white font-medium hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contato
                    </button>
                    
                    <button
                      onClick={() => isFavorito(criador.id) ? removerFavorito(criador.id, user?.id) : adicionarFavorito(criador.id, user?.id)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium 
                               transition-colors ${isFavorito(criador.id) 
                                 ? 'bg-red-100 text-red-600' 
                                 : 'bg-gray-100 text-[var(--asf-gray-dark)] hover:bg-gray-200'}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorito(criador.id) ? 'fill-current' : ''}`} />
                      {isFavorito(criador.id) ? 'Salvo' : 'Salvar'}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => compartilharPerfil({
                    nome: criador.nome,
                    cidade: criador.cidade,
                    estado: criador.estado,
                    especies: especies.map(e => e.nomes_populares[0]),
                  })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                           bg-gray-100 text-[var(--asf-gray-dark)] font-medium 
                           hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>

                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setEditedCriador(criador);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                             bg-[var(--asf-green)] text-white font-medium 
                             hover:bg-[var(--asf-green-dark)] transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-asf section-padding py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {isEditing ? (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] mb-4">
                  Sobre
                </h3>
                <textarea
                  value={editedCriador.bio || ''}
                  onChange={(e) => setEditedCriador({ ...editedCriador, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 
                           transition-all outline-none resize-none"
                  rows={4}
                  placeholder="Conte um pouco sobre você e seu trabalho com meliponicultura..."
                />
              </div>
            ) : criador.bio ? (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] mb-3">
                  Sobre
                </h3>
                <p className="text-[var(--asf-gray-medium)] leading-relaxed">{criador.bio}</p>
              </div>
            ) : null}

            {/* Espécies */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[var(--asf-green)]" />
                Espécies
                {isOwnProfile && !isEditing && (
                  <button onClick={() => setShowEspecieManager(true)} className="ml-auto text-sm text-[var(--asf-green)] hover:underline font-normal">
                    + Gerenciar
                  </button>
                )}
              </h3>
              
              {especies.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {especies.map((especie) => (
                    <div 
                      key={especie.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--asf-gray-light)]"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-6 h-6 text-[var(--asf-green)]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--asf-gray-dark)]">
                          {especie.nomes_populares[0]}
                        </p>
                        <p className="text-sm text-[var(--asf-gray-medium)] italic">
                          {especie.nome_cientifico}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[var(--asf-gray-medium)] mb-2">
                    Nenhuma espécie cadastrada ainda.
                  </p>
                  {isOwnProfile && (
                    <button onClick={() => setShowEspecieManager(true)} className="text-sm text-[var(--asf-green)] hover:underline">
                      Adicionar suas espécies
                    </button>
                  )}
                </div>
              )}

              {/* Modal de gerenciamento de espécies */}
              {showEspecieManager && (
                <EspecieManager
                  criadorId={id || ''}
                  currentEspecies={especies}
                  onClose={() => setShowEspecieManager(false)}
                  onUpdate={() => window.location.reload()}
                />
              )}
            </div>

            {/* Avaliações */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[var(--asf-yellow)]" />
                  Avaliações ({total})
                </h3>
                
                {!isOwnProfile && user && !mostrarFormAvaliacao && (
                  <button
                    onClick={() => setMostrarFormAvaliacao(true)}
                    className="text-sm text-[var(--asf-green)] hover:underline"
                  >
                    Avaliar criador
                  </button>
                )}
              </div>

              {/* Form de nova avaliação */}
              {mostrarFormAvaliacao && (
                <div className="mb-6 p-4 bg-[var(--asf-gray-light)] rounded-xl">
                  <h4 className="font-medium text-[var(--asf-gray-dark)] mb-3">
                    Sua avaliação
                  </h4>
                  <div className="mb-3">
                    <StarRating 
                      rating={novaAvaliacao.nota} 
                      interactive 
                      size="lg"
                      onRate={(nota) => setNovaAvaliacao({ ...novaAvaliacao, nota })}
                    />
                  </div>
                  <textarea
                    value={novaAvaliacao.comentario}
                    onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 resize-none"
                    rows={3}
                    placeholder="Conte sua experiência com este criador..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAvaliar}
                      disabled={novaAvaliacao.nota === 0}
                      className="px-4 py-2 rounded-lg bg-[var(--asf-green)] text-white text-sm
                               hover:bg-[var(--asf-green-dark)] disabled:opacity-50"
                    >
                      Enviar Avaliação
                    </button>
                    <button
                      onClick={() => setMostrarFormAvaliacao(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-[var(--asf-gray-dark)] text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de avaliações */}
              <div className="space-y-4">
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-[var(--asf-green)]">
                            {avaliacao.autor_nome.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-[var(--asf-gray-dark)]">
                          {avaliacao.autor_nome}
                        </span>
                      </div>
                      <StarRating rating={avaliacao.nota} size="sm" />
                    </div>
                    {avaliacao.comentario && (
                      <p className="text-[var(--asf-gray-medium)] text-sm">
                        {avaliacao.comentario}
                      </p>
                    )}
                    <p className="text-xs text-[var(--asf-gray-medium)] mt-1">
                      {new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Info de Contato */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] mb-4">
                Informações de Contato
              </h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--asf-gray-medium)] mb-1">
                      Telefone/WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={editedCriador.telefone || ''}
                      onChange={(e) => setEditedCriador({ ...editedCriador, telefone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--asf-green)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--asf-gray-medium)] mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={editedCriador.endereco || ''}
                      onChange={(e) => setEditedCriador({ ...editedCriador, endereco: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--asf-green)] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-[var(--asf-gray-medium)] mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={editedCriador.cidade || ''}
                        onChange={(e) => setEditedCriador({ ...editedCriador, cidade: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--asf-green)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--asf-gray-medium)] mb-1">
                        Estado
                      </label>
                      <select
                        value={editedCriador.estado || ''}
                        onChange={(e) => setEditedCriador({ ...editedCriador, estado: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--asf-green)] outline-none"
                      >
                        <option value="">Selecione</option>
                        {estados.map(uf => (
                          <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--asf-gray-medium)] mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['venda', 'troca', 'informacao'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            const current = (editedCriador.status || []) as string[];
                            const updated = current.includes(status)
                              ? current.filter(s => s !== status)
                              : [...current, status];
                            setEditedCriador({ ...editedCriador, status: updated });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                            (editedCriador.status || []).includes(status)
                              ? 'bg-[var(--asf-green)] text-white'
                              : 'bg-gray-100 text-[var(--asf-gray-dark)]'
                          }`}
                        >
                          {status === 'venda' ? 'Venda' : status === 'troca' ? 'Troca' : 'Informação'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[var(--asf-green)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--asf-gray-medium)]">WhatsApp</p>
                      <p className="font-medium text-[var(--asf-gray-dark)]">{criador.telefone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[var(--asf-green)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--asf-gray-medium)]">Localização</p>
                      <p className="font-medium text-[var(--asf-gray-dark)]">
                        {criador.endereco && `${criador.endereco}, `}
                        {criador.cidade}, {criador.estado}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-[var(--asf-gray-medium)] mb-2">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {criador.status.map((s) => (
                        <span
                          key={s}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            s === 'venda' ? 'bg-green-100 text-green-700' :
                            s === 'troca' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Informação'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de ação no modo edição */}
            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                           bg-[var(--asf-green)] text-white font-medium 
                           hover:bg-[var(--asf-green-dark)] disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCriador({});
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                           bg-gray-100 text-[var(--asf-gray-dark)] font-medium 
                           hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
