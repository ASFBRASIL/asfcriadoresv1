import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Leaf, Star, MessageSquare,
  Search, Check, Trash2, Edit2, Plus, X, Save,
  ChevronDown, ChevronUp, AlertTriangle, Settings, Shield,
  BarChart3, Filter, RefreshCw, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  useDashboardStats, useAdminCriadores, useAdminEspecies, useAdminAvaliacoes,
  type AdminCriador, type AdminEspecie,
} from '../hooks/useAdmin';
import { estados } from '../data/estados';

/* ── Helpers ── */

function StatCard({ title, value, icon: Icon, color = 'green' }: { title: string; value: number; icon: any; color?: string }) {
  const bg: Record<string, string> = { green: 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]', yellow: 'bg-[var(--asf-yellow)]/20 text-[var(--asf-yellow-dark)]', blue: 'bg-blue-50 text-blue-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div><p className="text-sm text-[var(--asf-gray-medium)] mb-1">{title}</p><p className="text-3xl font-bold text-[var(--asf-gray-dark)]">{value.toLocaleString('pt-BR')}</p></div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
    </div>
  );
}

function SimpleBar({ data, labelKey, valueKey }: { data: any[]; labelKey: string; valueKey: string }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-2.5">{data.map((item, i) => (
      <div key={i} className="flex items-center gap-3">
        <span className="text-sm text-[var(--asf-gray-medium)] w-24 truncate">{item[labelKey]}</span>
        <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--asf-green)] to-[var(--asf-green-light)] rounded-full" style={{ width: `${(item[valueKey] / max) * 100}%` }} /></div>
        <span className="text-sm font-semibold text-[var(--asf-gray-dark)] w-8 text-right">{item[valueKey]}</span>
      </div>
    ))}</div>
  );
}

function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${type === 'success' ? 'bg-[var(--asf-green)]' : 'bg-red-500'}`}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{message}
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="w-4 h-4" /></button>
    </div>
  );
}

function Confirm({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div><h3 className="font-poppins font-semibold text-lg">{title}</h3></div>
        <p className="text-[var(--asf-gray-medium)] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-100 font-medium hover:bg-gray-200">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

/* ── VISÃO GERAL ── */

function TabOverview({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Criadores" value={stats?.totalCriadores || 0} icon={Users} color="green" />
        <StatCard title="Espécies" value={stats?.totalEspecies || 0} icon={Leaf} color="yellow" />
        <StatCard title="Avaliações" value={stats?.totalAvaliacoes || 0} icon={Star} color="blue" />
        <StatCard title="Contatos" value={stats?.totalContatos || 0} icon={MessageSquare} color="purple" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[var(--asf-green)]" /> Criadores por Estado</h3>
          {stats?.criadoresPorEstado?.length > 0 ? <SimpleBar data={stats.criadoresPorEstado} labelKey="estado" valueKey="count" /> : <p className="text-[var(--asf-gray-medium)] text-sm">Sem dados.</p>}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-[var(--asf-yellow-dark)]" /> Espécies Populares</h3>
          {stats?.especiesMaisPopulares?.length > 0 ? <SimpleBar data={stats.especiesMaisPopulares} labelKey="especie" valueKey="count" /> : <p className="text-[var(--asf-gray-medium)] text-sm">Sem dados.</p>}
        </div>
      </div>
      {stats?.criadoresPorMes?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4">Novos Criadores por Mês</h3>
          <div className="flex items-end gap-3 h-40">
            {stats.criadoresPorMes.map((item: any, i: number) => {
              const mx = Math.max(...stats.criadoresPorMes.map((m: any) => m.count), 1);
              return (<div key={i} className="flex-1 flex flex-col items-center gap-2"><span className="text-xs font-semibold text-[var(--asf-green)]">{item.count}</span><div className="w-full bg-gradient-to-t from-[var(--asf-green)] to-[var(--asf-green-light)] rounded-t-lg" style={{ height: `${(item.count / mx) * 100}%`, minHeight: '8px' }} /><span className="text-xs text-[var(--asf-gray-medium)]">{item.mes}</span></div>);
            })}
          </div>
        </div>
      )}
      {stats?.avaliacoesPorNota?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4">Distribuição de Notas</h3>
          <div className="space-y-2">{stats.avaliacoesPorNota.map((item: any) => {
            const tot = stats.avaliacoesPorNota.reduce((s: number, a: any) => s + a.count, 0);
            return (<div key={item.nota} className="flex items-center gap-3"><div className="flex items-center gap-1 w-14"><Star className="w-4 h-4 fill-[var(--asf-yellow)] text-[var(--asf-yellow)]" /><span className="text-sm font-medium">{item.nota}</span></div><div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[var(--asf-yellow)] rounded-full" style={{ width: `${(item.count / tot) * 100}%` }} /></div><span className="text-sm text-[var(--asf-gray-medium)] w-20 text-right">{item.count} ({Math.round((item.count / tot) * 100)}%)</span></div>);
          })}</div>
        </div>
      )}
    </div>
  );
}

/* ── CRIADORES ── */

function TabCriadores({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const { criadores, isLoading, buscar, atualizar, verificar, excluir } = useAdminCriadores();
  const [search, setSearch] = useState('');
  const [uf, setUf] = useState('');
  const [ver, setVer] = useState<'todos' | 'sim' | 'nao'>('todos');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AdminCriador>>({});
  const [delId, setDelId] = useState<string | null>(null);
  const [expId, setExpId] = useState<string | null>(null);

  useEffect(() => { buscar(); }, [buscar]);

  const doSearch = () => buscar({ search, estado: uf, verificado: ver });
  const doSave = async (id: string) => {
    const r = await atualizar(id, editData);
    r.success ? (showToast('Criador atualizado!'), setEditId(null)) : showToast('Erro ao atualizar.', 'error');
  };

  return (
    <div className="space-y-4">
      {delId && <Confirm title="Excluir Criador" message="Todos os dados deste criador serão removidos permanentemente." onConfirm={async () => { await excluir(delId); showToast('Criador excluído.'); setDelId(null); }} onCancel={() => setDelId(null)} />}

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Buscar nome, email, cidade..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 outline-none text-sm" />
          </div>
          <select value={uf} onChange={e => setUf(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="">Todos UFs</option>{estados.map(u => <option key={u.sigla} value={u.sigla}>{u.sigla}</option>)}</select>
          <select value={ver} onChange={e => setVer(e.target.value as any)} className="px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="todos">Todos</option><option value="sim">Verificados</option><option value="nao">Pendentes</option></select>
          <button onClick={doSearch} className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] flex items-center gap-2"><Filter className="w-4 h-4" /> Filtrar</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--asf-gray-medium)]">{criadores.length} criador(es)</p>
        <button onClick={() => buscar()} className="text-sm text-[var(--asf-green)] hover:underline flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Atualizar</button>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" /></div>
       : criadores.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center border border-gray-100"><Users className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-[var(--asf-gray-medium)]">Nenhum criador encontrado.</p></div>
       : <div className="space-y-2">{criadores.map(c => (
        <div key={c.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
          {/* Row */}
          <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpId(expId === c.id ? null : c.id)}>
            <div className="w-11 h-11 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0"><span className="font-semibold text-[var(--asf-green)]">{c.nome.charAt(0)}</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><p className="font-medium text-[var(--asf-gray-dark)] truncate">{c.nome}</p>{c.verificado && <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs"><Check className="w-3 h-3 inline" /> Verificado</span>}</div>
              <p className="text-sm text-[var(--asf-gray-medium)] truncate">{c.email}</p>
            </div>
            <div className="hidden sm:block text-sm text-[var(--asf-gray-medium)]">{c.cidade}, {c.estado}</div>
            <div className="hidden md:flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 fill-[var(--asf-yellow)] text-[var(--asf-yellow)]" />{(c.avaliacao_media || 0).toFixed(1)}</div>
            <div className="flex items-center gap-1.5">
              <button onClick={e => { e.stopPropagation(); verificar(c.id, !c.verificado).then(() => showToast(c.verificado ? 'Verificação removida' : 'Verificado!')); }} className={`p-2 rounded-lg ${c.verificado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} title="Verificar"><Shield className="w-4 h-4" /></button>
              <button onClick={e => { e.stopPropagation(); setEditId(c.id); setEditData(c); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Editar"><Edit2 className="w-4 h-4" /></button>
              <button onClick={e => { e.stopPropagation(); setDelId(c.id); }} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" title="Excluir"><Trash2 className="w-4 h-4" /></button>
              {expId === c.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
          {/* Expanded */}
          {expId === c.id && <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50/50">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div><span className="text-[var(--asf-gray-medium)]">Telefone:</span> <b>{c.telefone || '—'}</b></div>
              <div><span className="text-[var(--asf-gray-medium)]">WhatsApp:</span> <b>{c.whatsapp || '—'}</b></div>
              <div><span className="text-[var(--asf-gray-medium)]">CEP:</span> <b>{c.cep || '—'}</b></div>
              <div><span className="text-[var(--asf-gray-medium)]">Endereço:</span> <b>{c.endereco || '—'}</b></div>
              <div><span className="text-[var(--asf-gray-medium)]">Coord.:</span> <b>{c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}</b></div>
              <div><span className="text-[var(--asf-gray-medium)]">Cadastro:</span> <b>{new Date(c.created_at).toLocaleDateString('pt-BR')}</b></div>
              <div className="sm:col-span-2 lg:col-span-3"><span className="text-[var(--asf-gray-medium)]">Status: </span>{c.status.map(s => <span key={s} className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-1 ${s === 'venda' ? 'bg-green-100 text-green-700' : s === 'troca' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Informação'}</span>)}</div>
              {c.bio && <div className="sm:col-span-2 lg:col-span-3"><span className="text-[var(--asf-gray-medium)]">Bio:</span> {c.bio}</div>}
            </div>
            <Link to={`/perfil/${c.id}`} className="inline-flex items-center gap-1 mt-3 text-sm text-[var(--asf-green)] hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Ver perfil público</Link>
          </div>}
          {/* Edit modal */}
          {editId === c.id && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditId(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><h3 className="font-poppins font-semibold text-lg">Editar Criador</h3><button onClick={() => setEditId(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Nome</label><input value={editData.nome || ''} onChange={e => setEditData({ ...editData, nome: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Email</label><input value={editData.email || ''} onChange={e => setEditData({ ...editData, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Telefone</label><input value={editData.telefone || ''} onChange={e => setEditData({ ...editData, telefone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">WhatsApp</label><input value={editData.whatsapp || ''} onChange={e => setEditData({ ...editData, whatsapp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                </div>
                <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Endereço</label><input value={editData.endereco || ''} onChange={e => setEditData({ ...editData, endereco: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Cidade</label><input value={editData.cidade || ''} onChange={e => setEditData({ ...editData, cidade: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">UF</label><select value={editData.estado || ''} onChange={e => setEditData({ ...editData, estado: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="">UF</option>{estados.map(u => <option key={u.sigla} value={u.sigla}>{u.sigla}</option>)}</select></div>
                  <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">CEP</label><input value={editData.cep || ''} onChange={e => setEditData({ ...editData, cep: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
                </div>
                <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Bio</label><textarea value={editData.bio || ''} onChange={e => setEditData({ ...editData, bio: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm resize-none" /></div>
                <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-2">Status</label><div className="flex gap-2">{(['venda', 'troca', 'informacao'] as const).map(s => <button key={s} type="button" onClick={() => { const cur = editData.status || []; setEditData({ ...editData, status: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] }); }} className={`px-3 py-1.5 rounded-lg text-sm ${(editData.status || []).includes(s) ? 'bg-[var(--asf-green)] text-white' : 'bg-gray-100'}`}>{s === 'venda' ? 'Venda' : s === 'troca' ? 'Troca' : 'Informação'}</button>)}</div></div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => setEditId(null)} className="px-4 py-2.5 rounded-xl bg-gray-100 font-medium text-sm">Cancelar</button>
                <button onClick={() => doSave(c.id)} className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white font-medium text-sm hover:bg-[var(--asf-green-dark)] flex items-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
              </div>
            </div>
          </div>}
        </div>
      ))}</div>}
    </div>
  );
}

/* ── ESPÉCIES ── */

function TabEspecies({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const { especies, isLoading, buscar, criar, atualizar, excluir } = useAdminEspecies();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const emptyForm = { id: '', nomeCientifico: '', nomesPopulares: '', familia: 'Apidae', tamanho: 'média', producaoMel: 'média', comportamento: '', dificuldade: 'intermediário', caixaIdeal: '', temperamento: '', conservacaoStatus: 'comum', biomas: [] as string[] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { buscar(); }, [buscar]);

  const reset = () => { setForm(emptyForm); setShowForm(false); setEditingId(null); };

  const edit = (e: AdminEspecie) => {
    setForm({ id: e.id, nomeCientifico: e.nomeCientifico, nomesPopulares: e.nomesPopulares.join(', '), familia: e.familia, tamanho: e.tamanho, producaoMel: e.producaoMel, comportamento: e.comportamento, dificuldade: e.manejo?.dificuldade || 'intermediário', caixaIdeal: e.manejo?.caixaIdeal || '', temperamento: e.manejo?.temperamento || '', conservacaoStatus: e.conservacao?.status || 'comum', biomas: e.biomas || [] });
    setEditingId(e.id); setShowForm(true);
  };

  const submit = async () => {
    if (!form.nomeCientifico.trim()) return showToast('Nome científico obrigatório.', 'error');
    const payload: any = { id: form.id || form.nomeCientifico.toLowerCase().replace(/\s+/g, '-'), nomeCientifico: form.nomeCientifico, nomesPopulares: form.nomesPopulares.split(',').map(n => n.trim()).filter(Boolean), familia: form.familia, tamanho: form.tamanho, producaoMel: form.producaoMel, comportamento: form.comportamento, biomas: form.biomas, distribuicao: [], caracteristicas: [], fontes: [], mel: { descricao: '', propriedades: [], sabor: '' }, manejo: { dificuldade: form.dificuldade, caixaIdeal: form.caixaIdeal, temperamento: form.temperamento, cuidadosEspeciais: [] }, conservacao: { status: form.conservacaoStatus, ameacas: [] } };
    const r = editingId ? await atualizar(editingId, payload) : await criar(payload);
    r.success ? (showToast(editingId ? 'Atualizada!' : 'Criada!'), reset()) : showToast('Erro.', 'error');
  };

  const bms = ['Amazônia', 'Mata Atlântica', 'Cerrado', 'Caatinga', 'Pantanal', 'Pampa'];
  const csColors: Record<string, string> = { comum: 'bg-green-100 text-green-700', 'vulnerável': 'bg-yellow-100 text-yellow-700', 'ameaçada': 'bg-orange-100 text-orange-700', rara: 'bg-red-100 text-red-700' };
  const dfColors: Record<string, string> = { iniciante: 'bg-green-100 text-green-700', 'intermediário': 'bg-yellow-100 text-yellow-700', 'avançado': 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-4">
      {delId && <Confirm title="Excluir Espécie" message="A espécie será removida permanentemente." onConfirm={async () => { await excluir(delId); showToast('Excluída.'); setDelId(null); }} onCancel={() => setDelId(null)} />}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input placeholder="Buscar espécie..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscar(search)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
        <button onClick={() => buscar(search)} className="px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-medium hover:bg-gray-200">Buscar</button>
        <button onClick={() => { reset(); setShowForm(true); }} className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] flex items-center gap-2"><Plus className="w-4 h-4" /> Nova Espécie</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[var(--asf-green)]/20">
          <h3 className="font-poppins font-semibold mb-4">{editingId ? 'Editar' : 'Nova'} Espécie</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Nome Científico *</label><input value={form.nomeCientifico} onChange={e => setForm({ ...form, nomeCientifico: e.target.value })} placeholder="Tetragonisca angustula" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Nomes Populares (vírgula)</label><input value={form.nomesPopulares} onChange={e => setForm({ ...form, nomesPopulares: e.target.value })} placeholder="Jataí, Abelha-ouro" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--asf-green)] outline-none text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Família</label><input value={form.familia} onChange={e => setForm({ ...form, familia: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" /></div>
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Tamanho</label><select value={form.tamanho} onChange={e => setForm({ ...form, tamanho: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="pequena">Pequena</option><option value="média">Média</option><option value="grande">Grande</option></select></div>
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Conservação</label><select value={form.conservacaoStatus} onChange={e => setForm({ ...form, conservacaoStatus: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="comum">Comum</option><option value="vulnerável">Vulnerável</option><option value="ameaçada">Ameaçada</option><option value="rara">Rara</option></select></div>
              <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Dificuldade</label><select value={form.dificuldade} onChange={e => setForm({ ...form, dificuldade: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="iniciante">Iniciante</option><option value="intermediário">Intermediário</option><option value="avançado">Avançado</option></select></div>
            </div>
            <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-2">Biomas</label><div className="flex flex-wrap gap-2">{bms.map(b => <button key={b} type="button" onClick={() => setForm({ ...form, biomas: form.biomas.includes(b) ? form.biomas.filter(x => x !== b) : [...form.biomas, b] })} className={`px-3 py-1.5 rounded-lg text-sm ${form.biomas.includes(b) ? 'bg-[var(--asf-green)] text-white' : 'bg-gray-100'}`}>{b}</button>)}</div></div>
            <div><label className="block text-sm text-[var(--asf-gray-medium)] mb-1">Comportamento</label><textarea value={form.comportamento} onChange={e => setForm({ ...form, comportamento: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
            <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-gray-100 font-medium text-sm">Cancelar</button>
            <button onClick={submit} className="px-5 py-2.5 rounded-xl bg-[var(--asf-green)] text-white font-medium text-sm hover:bg-[var(--asf-green-dark)] flex items-center gap-2"><Save className="w-4 h-4" /> {editingId ? 'Atualizar' : 'Criar'}</button>
          </div>
        </div>
      )}

      <p className="text-sm text-[var(--asf-gray-medium)]">{especies.length} espécie(s)</p>

      {isLoading ? <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" /></div>
       : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{especies.map(e => (
        <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0"><p className="font-semibold text-[var(--asf-gray-dark)] truncate">{e.nomesPopulares?.[0] || e.nomeCientifico}</p><p className="text-sm text-[var(--asf-gray-medium)] italic truncate">{e.nomeCientifico}</p></div>
            <div className="flex gap-1 ml-2"><button onClick={() => edit(e)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Edit2 className="w-3.5 h-3.5" /></button><button onClick={() => setDelId(e.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${csColors[e.conservacao?.status] || 'bg-gray-100 text-gray-600'}`}>{e.conservacao?.status || '?'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dfColors[e.manejo?.dificuldade] || 'bg-gray-100 text-gray-600'}`}>{e.manejo?.dificuldade || '?'}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{e.tamanho}</span>
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

/* ── AVALIAÇÕES ── */

function TabAvaliacoes({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const { avaliacoes, isLoading, buscar, excluir } = useAdminAvaliacoes();
  const [delId, setDelId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => { buscar(); }, [buscar]);

  const doFilter = () => {
    const o: any = {};
    if (filtro === 'baixas') o.notaMax = 2;
    if (filtro === 'altas') o.notaMin = 4;
    buscar(o);
  };

  return (
    <div className="space-y-4">
      {delId && <Confirm title="Excluir Avaliação" message="A avaliação será removida permanentemente." onConfirm={async () => { await excluir(delId); showToast('Excluída.'); setDelId(null); }} onCancel={() => setDelId(null)} />}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filtro} onChange={e => setFiltro(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"><option value="todas">Todas as notas</option><option value="baixas">Notas 1-2 ⭐</option><option value="altas">Notas 4-5 ⭐</option></select>
        <button onClick={doFilter} className="px-4 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm font-medium hover:bg-[var(--asf-green-dark)] flex items-center gap-2"><Filter className="w-4 h-4" /> Filtrar</button>
        <span className="text-sm text-[var(--asf-gray-medium)] ml-auto">{avaliacoes.length} avaliação(ões)</span>
      </div>
      {isLoading ? <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[var(--asf-green)] border-t-transparent rounded-full" /></div>
       : avaliacoes.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center border border-gray-100"><Star className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-[var(--asf-gray-medium)]">Nenhuma avaliação.</p></div>
       : <div className="space-y-3">{avaliacoes.map(a => (
        <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><span className="text-sm font-semibold text-blue-600">{a.autor_nome.charAt(0)}</span></div>
                <div><p className="font-medium text-sm">{a.autor_nome}</p><p className="text-xs text-[var(--asf-gray-medium)]">sobre <b>{a.criador_nome || `#${a.criador_id.slice(0, 6)}`}</b> · {new Date(a.created_at).toLocaleDateString('pt-BR')}</p></div>
              </div>
              <div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < a.nota ? 'fill-[var(--asf-yellow)] text-[var(--asf-yellow)]' : 'text-gray-200'}`} />)}</div>
              {a.comentario && <p className="text-sm text-[var(--asf-gray-medium)]">{a.comentario}</p>}
            </div>
            <button onClick={() => setDelId(a.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

/* ── CONFIGURAÇÕES ── */

function TabConfig() {
  const { isSupabaseReady } = useAuth();
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-[var(--asf-green)]" /> Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100"><span className="text-sm text-[var(--asf-gray-medium)]">Supabase</span><span className={`px-3 py-1 rounded-full text-xs font-medium ${isSupabaseReady ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{isSupabaseReady ? '● Conectado' : '● Offline'}</span></div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100"><span className="text-sm text-[var(--asf-gray-medium)]">Ambiente</span><span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{window.location.hostname === 'localhost' ? 'Dev' : 'Produção'}</span></div>
          <div className="flex items-center justify-between py-3"><span className="text-sm text-[var(--asf-gray-medium)]">URL</span><span className="text-sm font-medium">{window.location.origin}</span></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4">Links Úteis</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Settings className="w-5 h-5 text-green-700" /></div>
            <div><p className="font-medium text-sm">Supabase</p><p className="text-xs text-[var(--asf-gray-medium)]">Banco e auth</p></div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </a>
          <a href="https://github.com/ASFBRASIL/asfcriadoresv2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center"><Settings className="w-5 h-5 text-gray-700" /></div>
            <div><p className="font-medium text-sm">GitHub</p><p className="text-xs text-[var(--asf-gray-medium)]">Código fonte</p></div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </a>
        </div>
      </div>
      {!isSupabaseReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div><h4 className="font-semibold text-yellow-800 mb-1">Modo Offline</h4><p className="text-sm text-yellow-700 mb-3">Supabase não configurado. Alterações são apenas locais.</p>
              <code className="block bg-yellow-100 rounded-lg p-3 text-xs text-yellow-900">VITE_SUPABASE_URL=https://seu-projeto.supabase.co<br />VITE_SUPABASE_ANON_KEY=sua-chave-anon</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── DASHBOARD PRINCIPAL ── */

export function Dashboard() {
  const { stats } = useDashboardStats();
  const { user, criador } = useAuth();
  const [tab, setTab] = useState<'overview' | 'criadores' | 'especies' | 'avaliacoes' | 'config'>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const show = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral', icon: BarChart3 },
    { id: 'criadores' as const, label: 'Criadores', icon: Users },
    { id: 'especies' as const, label: 'Espécies', icon: Leaf },
    { id: 'avaliacoes' as const, label: 'Avaliações', icon: Star },
    { id: 'config' as const, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div><h1 className="text-xl lg:text-2xl font-poppins font-bold text-[var(--asf-gray-dark)]">Painel Administrativo</h1><p className="text-sm text-[var(--asf-gray-medium)]">Gerencie criadores, espécies, avaliações e configurações</p></div>
            {user && <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--asf-green)]/10"><div className="w-6 h-6 rounded-full bg-[var(--asf-green)] flex items-center justify-center"><span className="text-xs font-semibold text-white">{criador?.nome?.charAt(0) || 'A'}</span></div><span className="text-sm font-medium text-[var(--asf-green)]">{criador?.nome?.split(' ')[0] || 'Admin'}</span></div>}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="container-asf section-padding">
          <div className="flex gap-1 overflow-x-auto -mb-px">{tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${tab === t.id ? 'border-[var(--asf-green)] text-[var(--asf-green)]' : 'border-transparent text-[var(--asf-gray-medium)] hover:text-[var(--asf-gray-dark)]'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}</div>
        </div>
      </div>
      {/* Content */}
      <div className="container-asf section-padding py-6">
        {tab === 'overview' && <TabOverview stats={stats} />}
        {tab === 'criadores' && <TabCriadores showToast={show} />}
        {tab === 'especies' && <TabEspecies showToast={show} />}
        {tab === 'avaliacoes' && <TabAvaliacoes showToast={show} />}
        {tab === 'config' && <TabConfig />}
      </div>
    </div>
  );
}
