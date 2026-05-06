import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Leaf, Droplets, Sun, MapPin, Beaker, Info, ChevronRight, Star, BookOpen } from 'lucide-react';
import { useEspecies } from '../hooks/useEspecies';
import { usePagination, PaginationControls } from '../hooks/usePagination';
import { useSEO } from '../hooks/useSEO';
import { Skeleton } from '../components/ui/skeleton';

// Filter options
const biomas = ['Amazônia', 'Mata Atlântica', 'Cerrado', 'Caatinga', 'Pantanal', 'Pampa'];
const tamanhos = [
  { value: 'pequena', label: 'Pequena' },
  { value: 'média', label: 'Média' },
  { value: 'grande', label: 'Grande' },
];
const dificuldades = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediário', label: 'Intermediário' },
  { value: 'avançado', label: 'Avançado' },
];
const conservacao = [
  { value: 'comum', label: 'Comum' },
  { value: 'vulnerável', label: 'Vulnerável' },
  { value: 'ameaçada', label: 'Ameaçada' },
];
const generos = [
  { value: 'Melipona', label: 'Melipona' },
  { value: 'Tetragonisca', label: 'Tetragonisca' },
  { value: 'Scaptotrigona', label: 'Scaptotrigona' },
  { value: 'Frieseomelitta', label: 'Frieseomelitta' },
  { value: 'Plebeia', label: 'Plebeia' },
  { value: 'Trigona', label: 'Trigona' },
  { value: 'Partamona', label: 'Partamona' },
  { value: 'Nannotrigona', label: 'Nannotrigona' },
];

// Status colors
const statusColors = {
  comum: 'bg-green-100 text-green-700',
  vulnerável: 'bg-yellow-100 text-yellow-700',
  ameaçada: 'bg-orange-100 text-orange-700',
  rara: 'bg-red-100 text-red-700',
};

const dificuldadeColors = {
  iniciante: 'bg-green-100 text-green-700',
  intermediário: 'bg-yellow-100 text-yellow-700',
  avançado: 'bg-red-100 text-red-700',
};

export function Especies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBiomas, setSelectedBiomas] = useState<string[]>([]);
  const [selectedTamanhos, setSelectedTamanhos] = useState<string[]>([]);
  const [selectedDificuldades, setSelectedDificuldades] = useState<string[]>([]);
  const [selectedConservacao, setSelectedConservacao] = useState<string[]>([]);
  const [selectedGeneros, setSelectedGeneros] = useState<string[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop';

  const handleImgError = (id: string) =>
    setImgErrors((prev) => ({ ...prev, [id]: true }));

  // Buscar espécies do Supabase (o hook já aplica filtros server-side ou client-side)
  const { especies: filteredEspecies, totalCatalogadas, isLoading } = useEspecies({
    biomas: selectedBiomas.length > 0 ? selectedBiomas : undefined,
    tamanhos: selectedTamanhos.length > 0 ? selectedTamanhos : undefined,
    dificuldades: selectedDificuldades.length > 0 ? selectedDificuldades : undefined,
    conservacao: selectedConservacao.length > 0 ? selectedConservacao : undefined,
    generos: selectedGeneros.length > 0 ? selectedGeneros : undefined,
    query: searchTerm.trim() || undefined,
  });

  useSEO({ title: 'Catálogo de Espécies', description: 'Explore o catálogo completo de espécies de abelhas sem ferrão do Brasil. Informações sobre manejo, mel, conservação e criadores.' });

  // Paginação
  const pagination = usePagination(filteredEspecies, 9);

  // Toggle filters
  const toggleBioma = (bioma: string) => {
    setSelectedBiomas(prev => 
      prev.includes(bioma) ? prev.filter(b => b !== bioma) : [...prev, bioma]
    );
  };

  const toggleTamanho = (tamanho: string) => {
    setSelectedTamanhos(prev => 
      prev.includes(tamanho) ? prev.filter(t => t !== tamanho) : [...prev, tamanho]
    );
  };

  const toggleDificuldade = (dificuldade: string) => {
    setSelectedDificuldades(prev => 
      prev.includes(dificuldade) ? prev.filter(d => d !== dificuldade) : [...prev, dificuldade]
    );
  };

  const toggleConservacao = (status: string) => {
    setSelectedConservacao(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleGenero = (genero: string) => {
    setSelectedGeneros(prev =>
      prev.includes(genero) ? prev.filter(g => g !== genero) : [...prev, genero]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBiomas([]);
    setSelectedTamanhos([]);
    setSelectedDificuldades([]);
    setSelectedConservacao([]);
    setSelectedGeneros([]);
    setSearchTerm('');
  };

  // Total active filters
  const activeFiltersCount = selectedBiomas.length + selectedTamanhos.length +
                            selectedDificuldades.length + selectedConservacao.length +
                            selectedGeneros.length;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[var(--asf-gray-light)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding py-6 lg:py-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--asf-green)]/10 
                          text-[var(--asf-green)] text-sm font-medium mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Encyclopedia Meliponícula</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-poppins font-bold text-[var(--asf-gray-dark)] mb-3">
              Conheça as Espécies
            </h1>
            <p className="text-[var(--asf-gray-medium)]">
              Explore as abelhas sem ferrão nativas do Brasil. Conheça suas características, 
              hábitats, comportamento e como criá-las. Informações técnicas compiladas de 
              diversas fontes científicas.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[var(--asf-green)] text-white">
        <div className="container-asf section-padding py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 lg:gap-10">
              <div>
                <div className="text-2xl lg:text-3xl font-bold">{totalCatalogadas}</div>
                <div className="text-white/70 text-sm">espécies catalogadas</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="hidden sm:block">
                <div className="text-2xl lg:text-3xl font-bold">6</div>
                <div className="text-white/70 text-sm">biomas</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="hidden md:block">
                <div className="text-2xl lg:text-3xl font-bold">400+</div>
                <div className="text-white/70 text-sm">espécies no Brasil</div>
              </div>
            </div>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 
                       hover:bg-white/20 transition-colors duration-300 text-sm"
            >
              <MapPin className="w-4 h-4" />
              Encontrar criadores
            </Link>
          </div>
        </div>
      </div>

      <div className="container-asf section-padding py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 lg:sticky lg:top-24">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar espécie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                           focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 
                           transition-all duration-300 outline-none text-sm"
                />
              </div>

              {/* Filter Toggle Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl 
                         bg-gray-50 hover:bg-gray-100 transition-colors duration-300 mb-4"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[var(--asf-gray-medium)]" />
                  <span className="text-sm text-[var(--asf-gray-dark)]">Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--asf-green)] text-white text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 text-[var(--asf-gray-medium)] transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
              </button>

              {/* Filters */}
              <div className={`space-y-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Clear filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-[var(--asf-green)] hover:underline"
                  >
                    Limpar todos os filtros
                  </button>
                )}

                {/* Biome Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--asf-green)]" />
                    Bioma
                  </h4>
                  <div className="space-y-1">
                    {biomas.map((bioma) => (
                      <button
                        key={bioma}
                        onClick={() => toggleBioma(bioma)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedBiomas.includes(bioma)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedBiomas.includes(bioma)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedBiomas.includes(bioma) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {bioma}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[var(--asf-green)]" />
                    Tamanho
                  </h4>
                  <div className="space-y-1">
                    {tamanhos.map((tamanho) => (
                      <button
                        key={tamanho.value}
                        onClick={() => toggleTamanho(tamanho.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedTamanhos.includes(tamanho.value)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedTamanhos.includes(tamanho.value)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedTamanhos.includes(tamanho.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {tamanho.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[var(--asf-green)]" />
                    Dificuldade
                  </h4>
                  <div className="space-y-1">
                    {dificuldades.map((dif) => (
                      <button
                        key={dif.value}
                        onClick={() => toggleDificuldade(dif.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedDificuldades.includes(dif.value)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedDificuldades.includes(dif.value)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedDificuldades.includes(dif.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {dif.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conservation Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[var(--asf-green)]" />
                    Conservação
                  </h4>
                  <div className="space-y-1">
                    {conservacao.map((cons) => (
                      <button
                        key={cons.value}
                        onClick={() => toggleConservacao(cons.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedConservacao.includes(cons.value)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedConservacao.includes(cons.value)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedConservacao.includes(cons.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {cons.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genus Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-[var(--asf-green)]" />
                    Gênero
                  </h4>
                  <div className="space-y-1">
                    {generos.map((gen) => (
                      <button
                        key={gen.value}
                        onClick={() => toggleGenero(gen.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedGeneros.includes(gen.value)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedGeneros.includes(gen.value)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedGeneros.includes(gen.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="italic">{gen.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Species Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[var(--asf-gray-medium)]">
                Mostrando <strong className="text-[var(--asf-gray-dark)]">{filteredEspecies.length}</strong> espécies
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--asf-green)] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-5 space-y-3">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEspecies.length > 0 ? (
              <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {pagination.items.map((especie) => (
                  <Link
                    to={`/especie/${especie.id}`}
                    key={especie.id}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer
                             border-2 border-[var(--asf-green)] shadow-sm hover:shadow-lg 
                             transition-all duration-300"
                  >
                    <div className="relative h-56 overflow-hidden bg-[var(--asf-green)]/20">
                      <img
                        src={imgErrors[especie.id] ? FALLBACK_IMG : (especie.imagem || FALLBACK_IMG)}
                        alt={especie.nomesPopulares[0]}
                        loading="lazy"
                        onError={() => handleImgError(especie.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Content overlay on image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusColors[especie.conservacao.status]}`}>
                          {especie.conservacao.status.charAt(0).toUpperCase() + especie.conservacao.status.slice(1)}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${dificuldadeColors[especie.manejo.dificuldade]}`}>
                          {especie.manejo.dificuldade.charAt(0).toUpperCase() + especie.manejo.dificuldade.slice(1)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-poppins font-bold text-xl text-white mb-1 drop-shadow-lg">
                        {especie.nomesPopulares[0]}
                      </h3>
                      <p className="text-sm italic text-white/80 mb-1 drop-shadow">
                        {especie.nomeCientifico}
                      </p>
                      {especie.genero && (
                        <p className="text-xs text-white/60 mb-2 drop-shadow">
                          Gênero: <span className="italic">{especie.genero}</span>
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {especie.biomas.slice(0, 3).map((bioma) => (
                          <span
                            key={bioma}
                            className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs"
                          >
                            {bioma}
                          </span>
                        ))}
                      </div>

                      {/* Quick info */}
                      <div className="flex items-center gap-4 text-xs text-white/90">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" />
                          <span className="capitalize">{especie.producaoMel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5" />
                          <span className="capitalize">{especie.tamanho}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-[var(--asf-green)]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <PaginationControls {...pagination} />
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-[var(--asf-gray-dark)] mb-2">
                  Nenhuma espécie encontrada
                </h3>
                <p className="text-sm text-[var(--asf-gray-medium)] mb-4">
                  Tente ajustar seus filtros ou buscar por outro termo
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-[var(--asf-green)] text-white text-sm
                           hover:bg-[var(--asf-green-dark)] transition-colors duration-300"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
