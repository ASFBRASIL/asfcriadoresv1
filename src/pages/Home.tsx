import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Leaf, ArrowRight, ChevronLeft, ChevronRight, Search, MessageCircle, Map } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

// Banner data for carousel
const banners = [
  {
    id: 1,
    title: 'Produtos para Meliponicultura',
    description: 'Caixas racionais, ferramentas e acessórios para seu meliponário',
    cta: 'Ver produtos',
    link: '/mapa',
    color: 'from-[var(--asf-green)] to-[var(--asf-green-light)]',
    icon: Leaf,
  },
  {
    id: 2,
    title: 'Aprenda sobre Meliponicultura',
    description: 'Conheça as espécies de abelhas sem ferrão nativas do Brasil',
    cta: 'Explorar espécies',
    link: '/especies',
    color: 'from-[var(--asf-yellow)] to-[var(--asf-yellow-dark)]',
    icon: Users,
  },
  {
    id: 3,
    title: 'Encontre Criadores Próximos',
    description: 'Use nosso mapa interativo para localizar meliponicultores',
    cta: 'Explorar mapa',
    link: '/mapa',
    color: 'from-blue-500 to-blue-600',
    icon: Map,
  },
];

// Stats data
const stats = [
  { value: '+500', label: 'Criadores cadastrados', icon: Users },
  { value: '+50', label: 'Espécies catalogadas', icon: Leaf },
  { value: '27', label: 'Estados atendidos', icon: MapPin },
];

// Features data
const features = [
  {
    title: 'Busca por espécies',
    description: 'Filtre por Jataí, Mandacaia, Uruçu e outras centenas de abelhas nativas do Brasil. Encontre exatamente o que você precisa.',
    icon: Search,
  },
  {
    title: 'Localização geográfica',
    description: 'Encontre meliponicultores no seu bairro ou região para troca de experiências e colônias. Conecte-se com criadores próximos.',
    icon: MapPin,
  },
  {
    title: 'Contato via WhatsApp',
    description: 'Comunique-se instantaneamente com criadores verificados para tirar dúvidas ou negociar. Atendimento rápido e direto.',
    icon: MessageCircle,
  },
];

export function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Reduced height (1/3 of original) */}
      <section className="relative pt-20 lg:pt-24 pb-8 lg:pb-12 bg-gradient-to-br from-[var(--asf-gray-light)] via-white to-[var(--asf-yellow)]/10">
        <div className="container-asf section-padding">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh] lg:min-h-[45vh]">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--asf-green)]/10 
                            text-[var(--asf-green)] text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                <span>+500 Criadores</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-[var(--asf-gray-dark)] 
                           leading-tight mb-4">
                Encontre criadores de{' '}
                <span className="text-gradient">abelhas sem ferrão</span> no Brasil
              </h1>
              
              <p className="text-base lg:text-lg text-[var(--asf-gray-medium)] mb-6 max-w-xl">
                Conectando apaixonados pela meliponicultura em todo o território nacional 
                para preservar nossas espécies nativas e fortalecer a comunidade de criadores.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  to="/mapa"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--asf-yellow)] 
                           text-[var(--asf-gray-dark)] font-medium hover:bg-[var(--asf-yellow-dark)] 
                           transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MapPin className="w-5 h-5" />
                  Ver mapa
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/sou-criador"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--asf-green)] 
                           text-[var(--asf-green)] font-medium hover:bg-[var(--asf-green)] hover:text-white
                           transition-all duration-300"
                >
                  Sou criador
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-5 h-5 text-[var(--asf-green)]" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold text-[var(--asf-green)]">
                        {stat.value}
                      </div>
                      <div className="text-xs text-[var(--asf-gray-medium)] whitespace-nowrap">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft-lg">
                <img
                  src="/images/banner-home-optimized.jpg"
                  alt="Abelhas sem ferrão no ninho"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Card - hidden on small screens to prevent overflow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="hidden sm:block absolute -bottom-4 left-0 sm:-left-4 lg:-left-8 bg-white rounded-xl shadow-lg p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--asf-green)]" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[var(--asf-green)]">+500</div>
                    <div className="text-xs sm:text-sm text-[var(--asf-gray-medium)]">Criadores ativos</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banner Carousel Section */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container-asf section-padding">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex-[0_0_100%] min-w-0">
                    <div className={`relative bg-gradient-to-r ${banner.color} p-6 lg:p-10`}>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <banner.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl lg:text-2xl font-poppins font-bold text-white mb-1">
                              {banner.title}
                            </h3>
                            <p className="text-white/80 text-sm lg:text-base">
                              {banner.description}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={banner.link}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                                   bg-white text-[var(--asf-gray-dark)] font-medium 
                                   hover:bg-gray-100 transition-all duration-300 flex-shrink-0"
                        >
                          {banner.cta}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                       bg-white/90 shadow-lg flex items-center justify-center
                       hover:bg-white transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--asf-gray-dark)]" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                       bg-white/90 shadow-lg flex items-center justify-center
                       hover:bg-white transition-all duration-300 z-10"
            >
              <ChevronRight className="w-5 h-5 text-[var(--asf-gray-dark)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-12 lg:py-16 bg-[var(--asf-gray-light)]">
        <div className="container-asf section-padding">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-3">
              Mapa de Criadores
            </h2>
            <p className="text-[var(--asf-gray-medium)] max-w-2xl mx-auto">
              Explore a comunidade próxima a você. Encontre criadores de abelhas sem ferrão em qualquer região do Brasil.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Mini Map Preview */}
              <div className="lg:col-span-3 h-72 lg:h-96 bg-gradient-to-br from-[var(--asf-green)]/10 to-[var(--asf-yellow)]/10 
                            relative overflow-hidden">
                {/* Background Map */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Silhueta simplificada do Brasil */}
                    <path 
                      d="M400,50 Q500,80 550,150 Q600,200 580,280 Q560,350 520,400 Q480,450 450,500 Q420,550 380,520 Q340,490 300,450 Q260,410 250,350 Q240,290 280,230 Q320,170 350,120 Q380,70 400,50Z" 
                      fill="#2F6B4F" 
                      transform="translate(100,50) scale(1.2)"
                    />
                  </svg>
                </div>
                
                {/* Marcadores de Criadores */}
                <div className="absolute inset-0">
                  {/* São Paulo */}
                  <Link to="/mapa" className="absolute top-[55%] left-[52%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full animate-pulse" />
                      <div className="absolute -inset-2 bg-[var(--asf-green)]/30 rounded-full animate-ping" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        São Paulo
                      </div>
                    </div>
                  </Link>
                  
                  {/* Rio de Janeiro */}
                  <Link to="/mapa" className="absolute top-[58%] left-[60%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Rio de Janeiro
                      </div>
                    </div>
                  </Link>
                  
                  {/* Bahia */}
                  <Link to="/mapa" className="absolute top-[45%] left-[65%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Bahia
                      </div>
                    </div>
                  </Link>
                  
                  {/* Minas Gerais */}
                  <Link to="/mapa" className="absolute top-[50%] left-[58%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Minas Gerais
                      </div>
                    </div>
                  </Link>
                  
                  {/* Paraná */}
                  <Link to="/mapa" className="absolute top-[62%] left-[48%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Paraná
                      </div>
                    </div>
                  </Link>
                  
                  {/* Amazonas */}
                  <Link to="/mapa" className="absolute top-[25%] left-[35%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Amazonas
                      </div>
                    </div>
                  </Link>
                  
                  {/* Ceará */}
                  <Link to="/mapa" className="absolute top-[35%] left-[70%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Ceará
                      </div>
                    </div>
                  </Link>
                  
                  {/* Rio Grande do Sul */}
                  <Link to="/mapa" className="absolute top-[72%] left-[45%] group">
                    <div className="relative">
                      <div className="w-4 h-4 bg-[var(--asf-green)] rounded-full" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg 
                                    text-xs font-medium text-[var(--asf-gray-dark)] opacity-0 group-hover:opacity-100 
                                    transition-opacity whitespace-nowrap z-10">
                        Rio Grande do Sul
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--asf-gray-medium)]">Criadores ativos</p>
                        <p className="text-2xl font-bold text-[var(--asf-green)]">+500</p>
                      </div>
                      <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-[var(--asf-green)]/20 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-[var(--asf-green)]">{String.fromCharCode(64+i)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Info Panel */}
              <div className="lg:col-span-2 p-6 lg:p-8 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold text-[var(--asf-green)]">33</div>
                    <div className="text-sm text-[var(--asf-gray-medium)]">criadores ativos</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--asf-yellow)]/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[var(--asf-yellow-dark)]" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--asf-green)]" />
                    <span className="text-[var(--asf-gray-medium)]">Filtro por espécies</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--asf-green)]" />
                    <span className="text-[var(--asf-gray-medium)]">Geolocalização</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--asf-green)]" />
                    <span className="text-[var(--asf-gray-medium)]">Contato direto</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--asf-green)]" />
                    <span className="text-[var(--asf-gray-medium)]">Avaliações</span>
                  </div>
                </div>
                
                <Link
                  to="/mapa"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                           bg-[var(--asf-green)] text-white font-medium 
                           hover:bg-[var(--asf-green-dark)] transition-all duration-300"
                >
                  <Map className="w-5 h-5" />
                  Explorar Mapa Interativo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-asf section-padding">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-3">
              Nossos Recursos
            </h2>
            <p className="text-[var(--asf-gray-medium)] max-w-2xl mx-auto">
              Tudo o que você precisa para se conectar com a meliponicultura brasileira de forma simples e rápida.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--asf-gray-light)] rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--asf-green)]/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-[var(--asf-green)]" />
                </div>
                <h3 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--asf-gray-medium)] text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <Link
                  to="/mapa"
                  className="inline-flex items-center gap-2 text-[var(--asf-green)] font-medium text-sm
                           hover:gap-3 transition-all duration-300"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-[var(--asf-green)] to-[var(--asf-green-dark)]">
        <div className="container-asf section-padding">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-white mb-4">
              Quer fazer parte dessa comunidade?
            </h2>
            <p className="text-white/80 mb-6">
              Cadastre-se como criador e conecte-se com outros meliponicultores de todo o Brasil.
            </p>
            <Link
              to="/sou-criador"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--asf-yellow)] 
                       text-[var(--asf-gray-dark)] font-semibold hover:bg-[var(--asf-yellow-light)] 
                       transition-all duration-300 hover:-translate-y-0.5"
            >
              Cadastre-se como criador
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
