import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Leaf, MapPin, Droplets, Shield, BookOpen, AlertTriangle,
  ArrowLeft, ChevronRight, Beaker, Users, Info, ExternalLink, Star
} from 'lucide-react';
import { especies as mockEspecies, type Especie } from '../data/especies';
import { criadores as mockCriadores } from '../data/criadores';
import { useEspecie } from '../hooks/useEspecies';
import { useSEO } from '../hooks/useSEO';

const statusColors: Record<string, string> = {
  comum: 'bg-green-100 text-green-700 border-green-200',
  'vulnerável': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'ameaçada': 'bg-orange-100 text-orange-700 border-orange-200',
  rara: 'bg-red-100 text-red-700 border-red-200',
};
const diffColors: Record<string, string> = {
  iniciante: 'bg-green-100 text-green-700',
  'intermediário': 'bg-yellow-100 text-yellow-700',
  'avançado': 'bg-red-100 text-red-700',
};

function InfoCard({ icon: Icon, title, children, color = 'green' }: { icon: any; title: string; children: React.ReactNode; color?: string }) {
  const iconBg: Record<string, string> = { green: 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]', yellow: 'bg-[var(--asf-yellow)]/20 text-[var(--asf-yellow-dark)]', blue: 'bg-blue-50 text-blue-600', red: 'bg-red-50 text-red-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[color]}`}><Icon className="w-5 h-5" /></div>
        <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function EspecieDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { especie: supabaseEspecie } = useEspecie(id || null);
  const mockEspecie = useMemo(() => mockEspecies.find(e => e.id === id), [id]);
  const especie = (supabaseEspecie || mockEspecie) as Especie | null | undefined;

  // Criadores que possuem esta espécie (mock)
  const criadoresComEspecie = useMemo(() => {
    if (!especie) return [];
    const nomes = especie.nomesPopulares.map(n => n.toLowerCase());
    return mockCriadores.filter(c =>
      c.especies?.some(e => nomes.includes(e.toLowerCase())) ||
      c.descricao?.toLowerCase().includes(especie.nomeCientifico.toLowerCase())
    ).slice(0, 6);
  }, [especie]);

  useSEO({
    title: especie ? `${especie.nomesPopulares[0]} (${especie.nomeCientifico})` : 'Espécie não encontrada',
    description: especie ? `Saiba tudo sobre ${especie.nomesPopulares[0]}: manejo, mel, conservação e criadores. ${especie.comportamento.slice(0, 100)}` : undefined,
  });

  if (!especie) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding py-16 text-center">
          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-2">Espécie não encontrada</h2>
          <p className="text-[var(--asf-gray-medium)] mb-6">A espécie que você procura não existe no nosso catálogo.</p>
          <Link to="/especies" className="inline-flex px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors">Ver todas espécies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)] text-white py-10 lg:py-14">
        <div className="container-asf section-padding">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><ChevronRight className="w-3 h-3" />
            <Link to="/especies" className="hover:text-white">Espécies</Link><ChevronRight className="w-3 h-3" />
            <span className="text-white">{especie.nomesPopulares[0]}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[especie.conservacao.status]}`}>
                {especie.conservacao.status.charAt(0).toUpperCase() + especie.conservacao.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${diffColors[especie.manejo.dificuldade]}`}>
                {especie.manejo.dificuldade.charAt(0).toUpperCase() + especie.manejo.dificuldade.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">{especie.tamanho}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-2">{especie.nomesPopulares[0]}</h1>
            <p className="text-lg italic text-white/80 mb-3">{especie.nomeCientifico}</p>
            {especie.nomesPopulares.length > 1 && (
              <p className="text-sm text-white/70">Também conhecida como: {especie.nomesPopulares.slice(1).join(', ')}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-asf section-padding py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Comportamento */}
            <InfoCard icon={Info} title="Comportamento" color="green">
              <p className="text-[var(--asf-gray-medium)] leading-relaxed">{especie.comportamento}</p>
            </InfoCard>

            {/* Características */}
            {especie.caracteristicas.length > 0 && (
              <InfoCard icon={Star} title="Características" color="yellow">
                <ul className="space-y-2">
                  {especie.caracteristicas.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--asf-gray-medium)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--asf-yellow)] mt-2 flex-shrink-0" />{c}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            )}

            {/* Mel */}
            <InfoCard icon={Droplets} title="Mel" color="yellow">
              <p className="text-[var(--asf-gray-medium)] mb-3">{especie.mel.descricao}</p>
              {especie.mel.sabor && <p className="text-sm"><strong>Sabor:</strong> {especie.mel.sabor}</p>}
              {especie.mel.propriedades.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Propriedades:</p>
                  <div className="flex flex-wrap gap-2">
                    {especie.mel.propriedades.map(p => (
                      <span key={p} className="px-2.5 py-1 rounded-full bg-[var(--asf-yellow)]/10 text-[var(--asf-yellow-dark)] text-xs">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </InfoCard>

            {/* Manejo */}
            <InfoCard icon={BookOpen} title="Manejo" color="blue">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[var(--asf-gray-medium)]">Dificuldade</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffColors[especie.manejo.dificuldade]}`}>{especie.manejo.dificuldade}</span>
                </div>
                {especie.manejo.caixaIdeal && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)]">Caixa ideal</span><span className="font-medium">{especie.manejo.caixaIdeal}</span></div>}
                {especie.manejo.temperamento && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-[var(--asf-gray-medium)]">Temperamento</span><span className="font-medium">{especie.manejo.temperamento}</span></div>}
                {especie.manejo.cuidadosEspeciais.length > 0 && (
                  <div className="pt-2">
                    <p className="font-medium mb-2">Cuidados especiais:</p>
                    <ul className="space-y-1.5">
                      {especie.manejo.cuidadosEspeciais.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--asf-gray-medium)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Conservação */}
            <InfoCard icon={Shield} title="Conservação" color="red">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[especie.conservacao.status]}`}>
                  Status: {especie.conservacao.status}
                </span>
              </div>
              {especie.conservacao.ameacas.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-orange-500" /> Ameaças:</p>
                  <ul className="space-y-1.5">
                    {especie.conservacao.ameacas.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--asf-gray-medium)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </InfoCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ficha rápida */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4">Ficha Rápida</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5"><span className="text-[var(--asf-gray-medium)]">Família</span><span className="font-medium">{especie.familia}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[var(--asf-gray-medium)]">Tamanho</span><span className="font-medium">{especie.tamanho}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[var(--asf-gray-medium)]">Produção de mel</span><span className="font-medium">{especie.producaoMel}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[var(--asf-gray-medium)]">Dificuldade</span><span className="font-medium">{especie.manejo.dificuldade}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[var(--asf-gray-medium)]">Conservação</span><span className="font-medium">{especie.conservacao.status}</span></div>
              </div>
            </div>

            {/* Biomas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--asf-green)]" /> Distribuição
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {especie.biomas.map(b => (
                  <span key={b} className="px-3 py-1.5 rounded-lg bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs font-medium">{b}</span>
                ))}
              </div>
              {especie.distribuicao.length > 0 && (
                <p className="text-sm text-[var(--asf-gray-medium)]">{especie.distribuicao.join(', ')}</p>
              )}
            </div>

            {/* Criadores */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--asf-green)]" /> Criadores
              </h3>
              {criadoresComEspecie.length > 0 ? (
                <div className="space-y-2">
                  {criadoresComEspecie.map(c => (
                    <Link key={c.id} to={`/perfil/${c.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--asf-green)]">{c.nome.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--asf-gray-dark)] truncate">{c.nome}</p>
                        <p className="text-xs text-[var(--asf-gray-medium)]">{c.cidade}, {c.estado}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                    </Link>
                  ))}
                  <Link to={`/mapa?especie=${especie.id}`}
                    className="block text-center text-sm text-[var(--asf-green)] hover:underline pt-2">
                    Ver todos no mapa →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-[var(--asf-gray-medium)]">Nenhum criador cadastrado para esta espécie ainda.</p>
              )}
            </div>

            {/* Fontes */}
            {especie.fontes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-purple-500" /> Fontes
                </h3>
                <ul className="space-y-1.5">
                  {especie.fontes.map((f, i) => (
                    <li key={i} className="text-xs text-[var(--asf-gray-medium)]">• {f}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link to="/especies" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-100 text-[var(--asf-gray-dark)] text-sm font-medium hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
