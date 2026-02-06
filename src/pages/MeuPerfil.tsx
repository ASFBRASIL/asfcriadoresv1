import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Star, Edit2, Camera, Save, X, Leaf, Check,
  Eye, LogOut, Settings, User, Mail, MessageCircle, Search, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUpdateCriador, useUploadAvatar } from '../hooks/useCriadores';
import { estados } from '../data/estados';
import { especies as allEspeciesMock, buscarEspecies } from '../data/especies';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ======================== ESPECIE MANAGER MODAL ========================
function EspecieManager({ criadorId, currentEspecies, onClose, onUpdate }: {
  criadorId: string; currentEspecies: any[]; onClose: () => void; onUpdate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(currentEspecies.map(e => e.id)));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const found = buscarEspecies(search).slice(0, 8);
    setResults(found);
  }, [search]);

  const toggle = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSave = async () => {
    setSaving(true);
    if (isSupabaseConfigured()) {
      await supabase.from('criador_especies').delete().eq('criador_id', criadorId);
      if (selected.size > 0) {
        const rows = Array.from(selected).map(espId => ({ criador_id: criadorId, especie_id: espId, disponivel: true }));
        await supabase.from('criador_especies').insert(rows);
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

        {selected.size > 0 && (
          <div className="mb-4">
            <p className="text-sm text-[var(--asf-gray-medium)] mb-2">{selected.size} espécie(s) selecionada(s):</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(selected).map(id => {
                const esp = allEspeciesMock.find(e => e.id === id) || currentEspecies.find(e => e.id === id);
                return esp ? (
                  <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-sm">
                    <Leaf className="w-3 h-3" />{esp.nomesPopulares?.[0] || esp.nomes_populares?.[0] || esp.nomeCientifico || esp.nome_cientifico}
                    <button onClick={() => toggle(id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar espécie por nome..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" />
        </div>

        {results.length > 0 && (
          <div className="space-y-1 mb-4 max-h-60 overflow-y-auto">
            {results.map(esp => {
              const isSelected = selected.has(esp.id);
              return (
                <button key={esp.id} onClick={() => toggle(esp.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-[var(--asf-green)]/10 border border-[var(--asf-green)]/30' : 'hover:bg-gray-50 border border-transparent'}`}>
                  <div className="w-9 h-9 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-[var(--asf-green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--asf-gray-dark)] truncate">{esp.nomesPopulares[0]}</p>
                    <p className="text-xs text-[var(--asf-gray-medium)] italic truncate">{esp.nomeCientifico}</p>
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

// ======================== MAIN COMPONENT ========================
export function MeuPerfil() {
  const { user, criador, signOut, refreshCriador, isAdmin, isCriadorLoading } = useAuth();
  const { updateCriador, isLoading: isUpdating } = useUpdateCriador();
  const { uploadAvatar, isLoading: isUploading } = useUploadAvatar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'perfil' | 'especies' | 'config'>('perfil');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showEspecieManager, setShowEspecieManager] = useState(false);
  const [especies, setEspecies] = useState<any[]>([]);
  const [loadingEspecies, setLoadingEspecies] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar espécies do criador
  useEffect(() => {
    if (!criador?.id || !isSupabaseConfigured()) {
      setLoadingEspecies(false);
      return;
    }

    const fetchEspecies = async () => {
      setLoadingEspecies(true);
      const { data } = await supabase
        .from('criador_especies')
        .select('especie:especie_id(*)')
        .eq('criador_id', criador.id)
        .eq('disponivel', true);

      if (data) {
        setEspecies(data.map((ce: any) => ce.especie).filter(Boolean));
      }
      setLoadingEspecies(false);
    };

    fetchEspecies();
  }, [criador?.id]);

  // Inicializar dados de edição quando criador carrega
  useEffect(() => {
    if (criador && !isEditing) {
      setEditData({
        nome: criador.nome || '',
        telefone: criador.telefone || '',
        whatsapp: criador.whatsapp || '',
        bio: criador.bio || '',
        endereco: criador.endereco || '',
        cidade: criador.cidade || '',
        estado: criador.estado || '',
        cep: criador.cep || '',
        status: criador.status || ['informacao'],
      });
    }
  }, [criador, isEditing]);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--asf-gray-light)]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[var(--asf-green)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--asf-gray-medium)]">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!criador && !isCriadorLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--asf-gray-light)]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--asf-yellow)]/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[var(--asf-yellow-dark)]" />
          </div>
          <h2 className="text-xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Perfil não encontrado</h2>
          <p className="text-[var(--asf-gray-medium)] mb-6">
            Seu perfil de criador ainda não foi criado. Isso pode acontecer se houve um erro durante o cadastro.
          </p>
          <button
            onClick={async () => {
              if (isSupabaseConfigured() && user) {
                const meta = user.user_metadata || {};
                await supabase.from('criadores').insert({
                  user_id: user.id,
                  nome: meta.nome || meta.full_name || user.email?.split('@')[0] || 'Criador',
                  email: user.email || '',
                  telefone: meta.telefone || '',
                  whatsapp: meta.telefone ? (meta.telefone.replace(/\D/g, '').startsWith('55') ? meta.telefone.replace(/\D/g, '') : '55' + meta.telefone.replace(/\D/g, '')) : '',
                  cidade: meta.cidade || '',
                  estado: meta.estado || '',
                  status: ['informacao'],
                  latitude: 0,
                  longitude: 0,
                  verificado: false,
                  avaliacao_media: 0,
                  total_avaliacoes: 0,
                  role: 'criador',
                });
                await refreshCriador();
              }
            }}
            className="px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors"
          >
            Criar meu perfil
          </button>
        </div>
      </div>
    );
  }

  if (!criador) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--asf-gray-light)]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[var(--asf-green)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--asf-gray-medium)]">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditData({
      nome: criador.nome || '',
      telefone: criador.telefone || '',
      whatsapp: criador.whatsapp || '',
      bio: criador.bio || '',
      endereco: criador.endereco || '',
      cidade: criador.cidade || '',
      estado: criador.estado || '',
      cep: criador.cep || '',
      status: criador.status || ['informacao'],
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updates = { ...editData };
    // Sincronizar whatsapp com telefone - garantir formato correto com 55 (Brasil)
    if (updates.telefone) {
      let clean = updates.telefone.replace(/\D/g, '');
      if (clean && !clean.startsWith('55')) {
        clean = '55' + clean;
      }
      updates.whatsapp = clean;
    }

    const { error } = await updateCriador(criador.id, updates);
    if (!error) {
      setIsEditing(false);
      setSaveMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setSaveMsg(''), 3000);
      await refreshCriador();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Preview local imediato
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setSaveMsg('Enviando foto...');

    const url = await uploadAvatar(file, user.id);
    if (url) {
      // Adicionar cache-buster para garantir que o browser busque a nova imagem
      const cacheBustUrl = url + '?t=' + Date.now();
      const { error } = await updateCriador(criador.id, { avatar_url: cacheBustUrl });
      if (!error) {
        setSaveMsg('Foto de perfil atualizada!');
        setTimeout(() => setSaveMsg(''), 3000);
        await refreshCriador();
        // Limpar preview local após refresh trazer o avatar do servidor
        setTimeout(() => setAvatarPreview(null), 500);
      } else {
        setSaveMsg('Erro ao salvar foto. Tente novamente.');
        setTimeout(() => setSaveMsg(''), 3000);
        setAvatarPreview(null);
      }
    } else {
      setSaveMsg('Erro ao fazer upload da foto. Tente novamente.');
      setTimeout(() => setSaveMsg(''), 3000);
      setAvatarPreview(null);
    }
    // Limpar input para permitir re-selecionar o mesmo arquivo
    if (fileInputRef.current) fileInputRef.current.value = '';
    // Revogar URL local para liberar memória
    URL.revokeObjectURL(localPreview);
  };

  const handleToggleStatus = (status: string) => {
    const current = editData.status || [];
    const updated = current.includes(status)
      ? current.filter((s: string) => s !== status)
      : [...current, status];
    setEditData({ ...editData, status: updated });
  };

  const refreshEspecies = async () => {
    if (!criador?.id) return;
    const { data } = await supabase
      .from('criador_especies')
      .select('especie:especie_id(*)')
      .eq('criador_id', criador.id)
      .eq('disponivel', true);
    if (data) {
      setEspecies(data.map((ce: any) => ce.especie).filter(Boolean));
    }
  };

  const tabs = [
    { id: 'perfil' as const, label: 'Meu Perfil', icon: User },
    { id: 'especies' as const, label: 'Minhas Espécies', icon: Leaf },
    { id: 'config' as const, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[var(--asf-gray-light)]">
      {/* Header do Perfil */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[var(--asf-green)]/10 flex items-center justify-center overflow-hidden">
                {(avatarPreview || criador.avatar_url) ? (
                  <img src={avatarPreview || criador.avatar_url} alt={criador.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[var(--asf-green)]">
                    {criador.nome.charAt(0)}
                  </span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--asf-green)] text-white flex items-center justify-center hover:bg-[var(--asf-green-dark)] transition-colors shadow-md"
                disabled={isUploading}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-poppins font-bold text-[var(--asf-gray-dark)]">
                {criador.nome}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {criador.cidade && (
                  <span className="flex items-center gap-1 text-sm text-[var(--asf-gray-medium)]">
                    <MapPin className="w-3.5 h-3.5" /> {criador.cidade}{criador.estado ? `, ${criador.estado}` : ''}
                  </span>
                )}
                {criador.verificado && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verificado
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-[var(--asf-gray-medium)]">
                  <Star className="w-3.5 h-3.5 text-[var(--asf-yellow)]" />
                  {(typeof criador.avaliacao_media === 'string' ? parseFloat(criador.avaliacao_media) : criador.avaliacao_media || 0).toFixed(1)}
                  <span className="text-xs">({criador.total_avaliacoes || 0})</span>
                </span>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex items-center gap-2">
              <Link
                to={`/perfil/${criador.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-[var(--asf-gray-dark)] hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" /> Ver Perfil Público
              </Link>
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--asf-green)]/10 text-sm font-medium text-[var(--asf-green)] hover:bg-[var(--asf-green)]/20 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Painel Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[var(--asf-green)] border-b-2 border-[var(--asf-green)] bg-[var(--asf-green)]/5'
                    : 'text-[var(--asf-gray-medium)] hover:text-[var(--asf-gray-dark)] hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success message */}
      {saveMsg && (
        <div className="container-asf section-padding pt-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
            <Check className="w-4 h-4" /> {saveMsg}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-asf section-padding py-6">
        {/* ======================== TAB: PERFIL ======================== */}
        {activeTab === 'perfil' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)]">
                Informações do Perfil
              </h2>
              {!isEditing ? (
                <button onClick={handleStartEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] transition-colors">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] disabled:opacity-50 transition-colors">
                    {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                  </button>
                  <button onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-[var(--asf-gray-dark)] hover:bg-gray-200 transition-colors">
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div className="bg-white rounded-2xl p-5">
                <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-1.5">
                  <User className="w-4 h-4 inline mr-1" /> Nome completo
                </label>
                {isEditing ? (
                  <input type="text" value={editData.nome} onChange={e => setEditData({ ...editData, nome: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                ) : (
                  <p className="text-[var(--asf-gray-dark)] font-medium">{criador.nome}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="bg-white rounded-2xl p-5">
                <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-1.5">
                  <Mail className="w-4 h-4 inline mr-1" /> E-mail
                </label>
                <p className="text-[var(--asf-gray-dark)]">{criador.email}</p>
                <p className="text-xs text-[var(--asf-gray-medium)] mt-1">O e-mail não pode ser alterado por aqui.</p>
              </div>

              {/* Telefone e WhatsApp */}
              <div className="bg-white rounded-2xl p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-1.5">
                      <Phone className="w-4 h-4 inline mr-1" /> Telefone
                    </label>
                    {isEditing ? (
                      <input type="tel" value={editData.telefone} onChange={e => setEditData({ ...editData, telefone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                    ) : (
                      <p className="text-[var(--asf-gray-dark)]">{criador.telefone || 'Não informado'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-1.5">
                      <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp
                    </label>
                    {isEditing ? (
                      <input type="tel" value={editData.whatsapp} onChange={e => setEditData({ ...editData, whatsapp: e.target.value })}
                        placeholder="5500000000000"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                    ) : (
                      <p className="text-[var(--asf-gray-dark)]">{criador.whatsapp || 'Não informado'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-2xl p-5">
                <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-1.5">
                  Sobre você
                </label>
                {isEditing ? (
                  <textarea value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value })}
                    rows={4} placeholder="Conte sobre sua experiência com meliponicultura..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm resize-none" />
                ) : (
                  <p className="text-[var(--asf-gray-dark)]">{criador.bio || 'Nenhuma descrição adicionada ainda.'}</p>
                )}
              </div>

              {/* Endereço */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className="text-sm font-medium text-[var(--asf-gray-medium)] mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Localização
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <input type="text" value={editData.endereco} onChange={e => setEditData({ ...editData, endereco: e.target.value })}
                      placeholder="Endereço (rua, número, bairro)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <input type="text" value={editData.cidade} onChange={e => setEditData({ ...editData, cidade: e.target.value })}
                        placeholder="Cidade"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                      <select value={editData.estado} onChange={e => setEditData({ ...editData, estado: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm">
                        <option value="">Estado</option>
                        {estados.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>)}
                      </select>
                      <input type="text" value={editData.cep} onChange={e => setEditData({ ...editData, cep: e.target.value })}
                        placeholder="CEP"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
                    </div>
                    <p className="text-xs text-[var(--asf-gray-medium)]">
                      Ao salvar, sua localização no mapa será atualizada automaticamente.
                    </p>
                  </div>
                ) : (
                  <div>
                    {criador.endereco && <p className="text-[var(--asf-gray-dark)]">{criador.endereco}</p>}
                    <p className="text-[var(--asf-gray-dark)]">
                      {criador.cidade || 'Cidade não informada'}
                      {criador.estado ? `, ${criador.estado}` : ''}
                      {criador.cep ? ` - CEP: ${criador.cep}` : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Status de disponibilidade */}
              <div className="bg-white rounded-2xl p-5">
                <label className="block text-sm font-medium text-[var(--asf-gray-medium)] mb-3">
                  Status de disponibilidade
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'venda', label: 'Venda', color: 'green' },
                      { key: 'troca', label: 'Troca', color: 'yellow' },
                      { key: 'informacao', label: 'Informação', color: 'blue' },
                    ].map(s => (
                      <button key={s.key} type="button" onClick={() => handleToggleStatus(s.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          (editData.status || []).includes(s.key)
                            ? 'bg-[var(--asf-green)] text-white'
                            : 'bg-gray-100 text-[var(--asf-gray-dark)] hover:bg-gray-200'
                        }`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(criador.status || []).map((s: string) => (
                      <span key={s} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        s === 'venda' ? 'bg-green-100 text-green-700' :
                        s === 'troca' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Informação'}
                      </span>
                    ))}
                    {(!criador.status || criador.status.length === 0) && (
                      <span className="text-sm text-[var(--asf-gray-medium)]">Nenhum status definido</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================== TAB: ESPÉCIES ======================== */}
        {activeTab === 'especies' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)]">
                Minhas Espécies
              </h2>
              <button onClick={() => setShowEspecieManager(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] transition-colors">
                <Leaf className="w-4 h-4" /> Gerenciar Espécies
              </button>
            </div>

            {loadingEspecies ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" />
              </div>
            ) : especies.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {especies.map((especie: any) => (
                  <Link
                    key={especie.id}
                    to={`/especie/${especie.slug || especie.id}`}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--asf-green)]/20 transition-colors">
                      <Leaf className="w-6 h-6 text-[var(--asf-green)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--asf-gray-dark)] truncate">
                        {especie.nomes_populares?.[0] || especie.nome_cientifico}
                      </p>
                      <p className="text-sm text-[var(--asf-gray-medium)] italic truncate">
                        {especie.nome_cientifico}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--asf-green)] transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <Leaf className="w-12 h-12 text-[var(--asf-green)]/30 mx-auto mb-3" />
                <h3 className="font-medium text-[var(--asf-gray-dark)] mb-2">
                  Nenhuma espécie cadastrada
                </h3>
                <p className="text-sm text-[var(--asf-gray-medium)] mb-4">
                  Adicione as espécies que você cria para que outros criadores possam encontrá-lo.
                </p>
                <button onClick={() => setShowEspecieManager(true)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] transition-colors">
                  Adicionar Espécies
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================== TAB: CONFIGURAÇÕES ======================== */}
        {activeTab === 'config' && (
          <div className="max-w-3xl space-y-4">
            <h2 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-6">
              Configurações da Conta
            </h2>

            {/* Links rápidos */}
            <div className="bg-white rounded-2xl divide-y divide-gray-100">
              <Link to={`/perfil/${criador.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors first:rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-[var(--asf-green)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--asf-gray-dark)] text-sm">Ver Perfil Público</p>
                    <p className="text-xs text-[var(--asf-gray-medium)]">Veja como outros criadores veem seu perfil</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link to="/favoritos"
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--asf-gray-dark)] text-sm">Meus Favoritos</p>
                    <p className="text-xs text-[var(--asf-gray-medium)]">Criadores que você salvou</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link to="/recuperar-senha"
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--asf-gray-dark)] text-sm">Alterar Senha</p>
                    <p className="text-xs text-[var(--asf-gray-medium)]">Solicitar troca de senha por e-mail</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>

            {/* Informações da conta */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-medium text-[var(--asf-gray-medium)] mb-3">Informações da Conta</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--asf-gray-medium)]">E-mail</span>
                  <span className="text-[var(--asf-gray-dark)]">{criador.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--asf-gray-medium)]">Membro desde</span>
                  <span className="text-[var(--asf-gray-dark)]">{new Date(criador.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--asf-gray-medium)]">Status da conta</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${criador.verificado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {criador.verificado ? 'Verificado' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sair */}
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair da conta
            </button>
          </div>
        )}
      </div>

      {/* Modal de gerenciamento de espécies */}
      {showEspecieManager && (
        <EspecieManager
          criadorId={criador.id}
          currentEspecies={especies}
          onClose={() => setShowEspecieManager(false)}
          onUpdate={refreshEspecies}
        />
      )}
    </div>
  );
}
