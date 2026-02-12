import { useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Leaf, MapPin, Droplets, Shield, BookOpen, AlertTriangle,
  ArrowLeft, ChevronRight, Beaker, Users, Info, ExternalLink, Star,
  Share2, Camera, X, ZoomIn, ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import { especies as mockEspecies, type Especie } from '../data/especies';
import { criadores as mockCriadores } from '../data/criadores';
import { useEspecie } from '../hooks/useEspecies';
import { useSEO } from '../hooks/useSEO';
import { Skeleton } from '../components/ui/skeleton';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const statusColors: Record<string, string> = {
  comum: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  'vulnerável': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  'ameaçada': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  rara: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

const diffColors: Record<string, string> = {
  iniciante: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'intermediário': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'avançado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

/** Placeholder gallery images (decorative bee / nature photos from Unsplash) */
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop',
    alt: 'Abelha coletando néctar em flor',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
    alt: 'Abelha em voo próximo a flores',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1568526381923-caf3fd520382?w=600&h=400&fit=crop',
    alt: 'Colmeia de abelhas sem ferrão',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&h=400&fit=crop',
    alt: 'Flores silvestres visitadas por abelhas',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1509540094585-1fd943e8005f?w=600&h=400&fit=crop',
    alt: 'Mel dourado em favo',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?w=600&h=400&fit=crop',
    alt: 'Abelha pousada em flor amarela',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoCard({
  icon: Icon,
  title,
  children,
  color = 'green',
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  color?: string;
}) {
  const iconBg: Record<string, string> = {
    green: 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]',
    yellow: 'bg-[var(--asf-yellow)]/20 text-[var(--asf-yellow-dark)]',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/** Lightbox modal for full-size gallery images */
function LightboxModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = images[currentIndex];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Fechar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="Anterior"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src.replace('w=600&h=400', 'w=1200&h=800')}
          alt={current.alt}
          className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="Próxima"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

/** Loading skeleton placeholder for the full page */
function EspecieDetalheSkeleton() {
  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)] dark:bg-gray-900">
      {/* Hero skeleton */}
      <div className="relative h-[340px] lg:h-[420px]">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      <div className="container-asf section-padding py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EspecieDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { especie: supabaseEspecie, isLoading } = useEspecie(id || null);
  const mockEspecie = useMemo(() => mockEspecies.find((e) => e.id === id), [id]);
  const especie = (supabaseEspecie || mockEspecie) as Especie | null | undefined;

  // Gallery lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null,
      ),
    [],
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % galleryImages.length : null,
      ),
    [],
  );

  // Criadores que possuem esta espécie (mock)
  const criadoresComEspecie = useMemo(() => {
    if (!especie) return [];
    const nomes = especie.nomesPopulares.map((n) => n.toLowerCase());
    return mockCriadores
      .filter(
        (c) =>
          c.especies?.some((e) => nomes.includes(e.toLowerCase())) ||
          c.descricao?.toLowerCase().includes(especie.nomeCientifico.toLowerCase()),
      )
      .slice(0, 6);
  }, [especie]);

  // Share handler (Web Share API with fallback)
  const handleShare = useCallback(async () => {
    const shareData = {
      title: especie ? `${especie.nomesPopulares[0]} (${especie.nomeCientifico})` : 'Espécie',
      text: especie
        ? `Confira informações sobre ${especie.nomesPopulares[0]} no ASF Brasil!`
        : '',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch {
      // User cancelled or share failed silently
    }
  }, [especie]);

  useSEO({
    title: especie
      ? `${especie.nomesPopulares[0]} (${especie.nomeCientifico})`
      : 'Espécie não encontrada',
    description: especie
      ? `Saiba tudo sobre ${especie.nomesPopulares[0]}: manejo, mel, conservação e criadores. ${especie.comportamento.slice(0, 100)}`
      : undefined,
  });

  // -- Loading state --
  if (isLoading && !especie) {
    return <EspecieDetalheSkeleton />;
  }

  // -- Not found --
  if (!especie) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)] dark:bg-gray-900">
        <div className="container-asf section-padding py-16 text-center">
          <Leaf className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-poppins font-bold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-2">
            Espécie não encontrada
          </h2>
          <p className="text-[var(--asf-gray-medium)] dark:text-gray-400 mb-6">
            A espécie que você procura não existe no nosso catálogo.
          </p>
          <Link
            to="/especies"
            className="inline-flex px-6 py-3 rounded-xl bg-[var(--asf-green)] text-white font-medium hover:bg-[var(--asf-green-dark)] transition-colors"
          >
            Ver todas espécies
          </Link>
        </div>
      </div>
    );
  }

  const hasHeroImage = !!especie.imagem;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-[var(--asf-gray-light)] dark:bg-gray-900 transition-colors">
      {/* ================================================================ */}
      {/* Hero Image Section                                               */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden">
        {/* Background image or gradient placeholder */}
        {hasHeroImage ? (
          <>
            <div className="absolute inset-0">
              <img
                src={especie.imagem}
                alt={especie.nomesPopulares[0]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--asf-green)] via-emerald-600 to-teal-700" >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-8xl lg:text-9xl select-none">🐝</div>
              <div className="absolute bottom-10 right-20 text-7xl lg:text-8xl select-none rotate-12">🌻</div>
              <div className="absolute top-1/2 right-10 text-6xl select-none -rotate-12 opacity-60">🍯</div>
            </div>
          </div>
        )}

        <div className="relative z-10 py-12 lg:py-20">
          <div className="container-asf section-padding">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 dark:text-white/60 mb-8">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/especies" className="hover:text-white transition-colors">
                Espécies
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">{especie.nomesPopulares[0]}</span>
            </nav>

            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[especie.conservacao.status]}`}
                >
                  {especie.conservacao.status.charAt(0).toUpperCase() +
                    especie.conservacao.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${diffColors[especie.manejo.dificuldade]}`}
                >
                  {especie.manejo.dificuldade.charAt(0).toUpperCase() +
                    especie.manejo.dificuldade.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  {especie.tamanho}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl font-poppins font-bold text-white mb-2 drop-shadow-lg">
                {especie.nomesPopulares[0]}
              </h1>
              <p className="text-lg lg:text-xl italic text-white/80 mb-1">
                {especie.nomeCientifico}
              </p>
              {especie.genero && (
                <p className="text-sm text-white/60 mb-2">
                  Gênero: <span className="italic">{especie.genero}</span>
                  {especie.subgenero && <> &middot; Subgênero: <span className="italic">{especie.subgenero}</span></>}
                </p>
              )}
              {especie.nomesPopulares.length > 1 && (
                <p className="text-sm text-white/70 mb-2">
                  Também conhecida como: {especie.nomesPopulares.slice(1).join(', ')}
                </p>
              )}
              {especie.nomesAlternativos && especie.nomesAlternativos.length > 0 && (
                <p className="text-sm text-white/60 mb-4">
                  Nomes regionais: {especie.nomesAlternativos.join(', ')}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
                <Link
                  to="/especies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Photo Gallery                                                    */}
      {/* ================================================================ */}
      <section className="container-asf section-padding py-8 lg:py-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="font-poppins font-semibold text-lg text-[var(--asf-gray-dark)] dark:text-gray-100">
            Galeria
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
          {galleryImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asf-green)] focus-visible:ring-offset-2"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--asf-gray-medium)] dark:text-gray-500 mt-3 text-center italic">
          Imagens ilustrativas. Fotos reais da espécie podem variar.
        </p>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      {/* ================================================================ */}
      {/* Content Grid                                                     */}
      {/* ================================================================ */}
      <div className="container-asf section-padding py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ============================================================ */}
          {/* Main content (2 cols)                                        */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comportamento */}
            <InfoCard icon={Info} title="Comportamento" color="green">
              <p className="text-[var(--asf-gray-medium)] dark:text-gray-300 leading-relaxed">
                {especie.comportamento}
              </p>
            </InfoCard>

            {/* Características */}
            {especie.caracteristicas.length > 0 && (
              <InfoCard icon={Star} title="Características" color="yellow">
                <ul className="space-y-2">
                  {especie.caracteristicas.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--asf-gray-medium)] dark:text-gray-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--asf-yellow)] mt-2 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            )}

            {/* Mel */}
            <InfoCard icon={Droplets} title="Mel" color="yellow">
              <p className="text-[var(--asf-gray-medium)] dark:text-gray-300 mb-3">
                {especie.mel.descricao}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                {especie.mel.sabor && (
                  <div className="text-sm dark:text-gray-300">
                    <strong className="dark:text-gray-200">Sabor:</strong> {especie.mel.sabor}
                  </div>
                )}
                {especie.mel.cor && (
                  <div className="text-sm dark:text-gray-300">
                    <strong className="dark:text-gray-200">Cor:</strong> {especie.mel.cor}
                  </div>
                )}
                {especie.mel.producaoAnual && (
                  <div className="text-sm dark:text-gray-300">
                    <strong className="dark:text-gray-200">Produção anual:</strong> {especie.mel.producaoAnual}
                  </div>
                )}
              </div>
              {especie.mel.propriedades.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2 dark:text-gray-200">Propriedades:</p>
                  <div className="flex flex-wrap gap-2">
                    {especie.mel.propriedades.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-1 rounded-full bg-[var(--asf-yellow)]/10 text-[var(--asf-yellow-dark)] dark:bg-yellow-900/20 dark:text-yellow-300 text-xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </InfoCard>

            {/* Manejo */}
            <InfoCard icon={BookOpen} title="Manejo" color="blue">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                    Dificuldade
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffColors[especie.manejo.dificuldade]}`}
                  >
                    {especie.manejo.dificuldade}
                  </span>
                </div>
                {especie.manejo.caixaIdeal && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                      Caixa ideal
                    </span>
                    <span className="font-medium dark:text-gray-200">
                      {especie.manejo.caixaIdeal}
                    </span>
                  </div>
                )}
                {especie.manejo.temperamento && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                      Temperamento
                    </span>
                    <span className="font-medium dark:text-gray-200">
                      {especie.manejo.temperamento}
                    </span>
                  </div>
                )}
                {especie.manejo.cuidadosEspeciais.length > 0 && (
                  <div className="pt-2">
                    <p className="font-medium mb-2 dark:text-gray-200">Cuidados especiais:</p>
                    <ul className="space-y-1.5">
                      {especie.manejo.cuidadosEspeciais.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[var(--asf-gray-medium)] dark:text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          {c}
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[especie.conservacao.status]}`}
                >
                  Status: {especie.conservacao.status}
                </span>
              </div>
              {especie.conservacao.ameacas.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1 dark:text-gray-200">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Ameaças:
                  </p>
                  <ul className="space-y-1.5">
                    {especie.conservacao.ameacas.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[var(--asf-gray-medium)] dark:text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </InfoCard>
          </div>

          {/* ============================================================ */}
          {/* Sidebar                                                      */}
          {/* ============================================================ */}
          <div className="space-y-6">
            {/* Ficha rápida */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-4">
                Ficha Rápida
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">Família</span>
                  <span className="font-medium dark:text-gray-200">{especie.familia}</span>
                </div>
                {especie.genero && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">Gênero</span>
                    <span className="font-medium italic dark:text-gray-200">{especie.genero}</span>
                  </div>
                )}
                {especie.subgenero && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">Subgênero</span>
                    <span className="font-medium italic dark:text-gray-200">{especie.subgenero}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">Tamanho</span>
                  <span className="font-medium dark:text-gray-200">{especie.tamanho}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                    Produção de mel
                  </span>
                  <span className="font-medium dark:text-gray-200">{especie.producaoMel}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                    Dificuldade
                  </span>
                  <span className="font-medium dark:text-gray-200">
                    {especie.manejo.dificuldade}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                    Conservação
                  </span>
                  <span className="font-medium dark:text-gray-200">
                    {especie.conservacao.status}
                  </span>
                </div>
                {especie.statusPesquisa && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-[var(--asf-gray-medium)] dark:text-gray-400">
                      Status pesquisa
                    </span>
                    <span className="font-medium dark:text-gray-200">
                      {especie.statusPesquisa}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Biomas / Distribuição */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--asf-green)]" /> Distribuição
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {especie.biomas.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 rounded-lg bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs font-medium dark:bg-green-900/20 dark:text-green-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
              {especie.distribuicao.length > 0 && (
                <p className="text-sm text-[var(--asf-gray-medium)] dark:text-gray-400">
                  {especie.distribuicao.join(', ')}
                </p>
              )}
            </div>

            {/* Criadores */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--asf-green)]" /> Criadores
              </h3>
              {criadoresComEspecie.length > 0 ? (
                <div className="space-y-2">
                  {criadoresComEspecie.map((c) => (
                    <Link
                      key={c.id}
                      to={`/perfil/${c.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--asf-green)]">
                          {c.nome.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--asf-gray-dark)] dark:text-gray-200 truncate">
                          {c.nome}
                        </p>
                        <p className="text-xs text-[var(--asf-gray-medium)] dark:text-gray-400">
                          {c.cidade}, {c.estado}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-500" />
                    </Link>
                  ))}
                  <Link
                    to={`/mapa?especie=${especie.id}`}
                    className="block text-center text-sm text-[var(--asf-green)] hover:underline pt-2"
                  >
                    Ver todos no mapa &rarr;
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-[var(--asf-gray-medium)] dark:text-gray-400">
                  Nenhum criador cadastrado para esta espécie ainda.
                </p>
              )}
            </div>

            {/* Fontes */}
            {especie.fontes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
                <h3 className="font-poppins font-semibold text-[var(--asf-gray-dark)] dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Fontes
                </h3>
                <ul className="space-y-1.5">
                  {especie.fontes.map((f, i) => (
                    <li
                      key={i}
                      className="text-xs text-[var(--asf-gray-medium)] dark:text-gray-400"
                    >
                      &bull; {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back link */}
            <Link
              to="/especies"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[var(--asf-gray-dark)] dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
