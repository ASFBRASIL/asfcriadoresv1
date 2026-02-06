import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Leaf, Droplets, Sun, MapPin, Beaker, Info, ChevronRight, Star, BookOpen } from 'lucide-react';
import { type Especie } from '../data/especies';
import { useEspecies } from '../hooks/useEspecies';
import { usePagination, PaginationControls } from '../hooks/usePagination';
import { useSEO } from '../hooks/useSEO';

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
  const [selectedEspecie, setSelectedEspecie] = useState<Especie | null>(null);

  // Buscar espécies do Supabase (o hook já aplica filtros server-side ou client-side)
  const { especies: filteredEspecies, totalCatalogadas } = useEspecies({
    biomas: selectedBiomas.length > 0 ? selectedBiomas : undefined,
    tamanhos: selectedTamanhos.length > 0 ? selectedTamanhos : undefined,
    dificuldades: selectedDificuldades.length > 0 ? selectedDificuldades : undefined,
    conservacao: selectedConservacao.length > 0 ? selectedConservacao : undefined,
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

  // Clear all filters
  const clearFilters = () => {
    setSelectedBiomas([]);
    setSelectedTamanhos([]);
    setSelectedDificuldades([]);
    setSelectedConservacao([]);
    setSearchTerm('');
  };

  // Total active filters
  const activeFiltersCount = selectedBiomas.length + selectedTamanhos.length + 
                            selectedDificuldades.length + selectedConservacao.length;

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

            {filteredEspecies.length > 0 ? (
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
                    {/* Background Image with 65% opacity */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop`}
                        alt={especie.nomesPopulares[0]}
                        className="w-full h-full object-cover opacity-65 group-hover:opacity-80 
                                 group-hover:scale-105 transition-all duration-500"
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
                      <p className="text-sm italic text-white/80 mb-3 drop-shadow">
                        {especie.nomeCientifico}
                      </p>

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

      {/* Species Detail Modal */}
      {selectedEspecie && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEspecie(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-56 lg:h-72">
              <img
                src={`https://placehold.co/800x400/2F6B4F/FFFFFF?text=${encodeURIComponent(selectedEspecie.nomesPopulares[0])}`}
                alt={selectedEspecie.nomesPopulares[0]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setSelectedEspecie(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
                         flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl lg:text-3xl font-poppins font-bold mb-1">
                  {selectedEspecie.nomesPopulares[0]}
                </h2>
                <p className="text-white/80 italic">{selectedEspecie.nomeCientifico}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedEspecie.conservacao.status]}`}>
                  {selectedEspecie.conservacao.status.charAt(0).toUpperCase() + selectedEspecie.conservacao.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${dificuldadeColors[selectedEspecie.manejo.dificuldade]}`}>
                  {selectedEspecie.manejo.dificuldade.charAt(0).toUpperCase() + selectedEspecie.manejo.dificuldade.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                  {selectedEspecie.tamanho.charAt(0).toUpperCase() + selectedEspecie.tamanho.slice(1)}
                </span>
              </div>

              {/* Alternative Names */}
              {selectedEspecie.nomesPopulares.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--asf-gray-medium)] mb-2">
                    Outros nomes populares
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEspecie.nomesPopulares.slice(1).map((nome) => (
                      <span key={nome} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm">
                        {nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Characteristics */}
              <div className="mb-6">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  Características
                </h4>
                <ul className="space-y-2">
                  {selectedEspecie.caracteristicas.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-[var(--asf-gray-medium)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--asf-green)] mt-2 flex-shrink-0" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Behavior */}
              <div className="mb-6">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  Comportamento
                </h4>
                <p className="text-[var(--asf-gray-medium)] leading-relaxed">
                  {selectedEspecie.comportamento}
                </p>
              </div>

              {/* Honey */}
              <div className="mb-6 bg-[var(--asf-yellow)]/10 rounded-xl p-4">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-[var(--asf-yellow-dark)]" />
                  Mel
                </h4>
                <p className="text-[var(--asf-gray-medium)] mb-3">{selectedEspecie.mel.descricao}</p>
                <div className="mb-3">
                  <span className="text-sm font-medium text-[var(--asf-gray-dark)]">Sabor: </span>
                  <span className="text-[var(--asf-gray-medium)]">{selectedEspecie.mel.sabor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEspecie.mel.propriedades.map((prop, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-[var(--asf-yellow)]/30 text-[var(--asf-gray-dark)] text-xs">
                      {prop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Management */}
              <div className="mb-6">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  Manejo
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-[var(--asf-gray-medium)]">Caixa ideal</span>
                    <p className="font-medium text-[var(--asf-gray-dark)]">{selectedEspecie.manejo.caixaIdeal}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-[var(--asf-gray-medium)]">Temperamento</span>
                    <p className="font-medium text-[var(--asf-gray-dark)]">{selectedEspecie.manejo.temperamento}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-[var(--asf-gray-medium)]">Cuidados especiais</span>
                  <ul className="mt-2 space-y-1">
                    {selectedEspecie.manejo.cuidadosEspeciais.map((cuidado, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--asf-gray-medium)] text-sm">
                        <span className="w-1 h-1 rounded-full bg-[var(--asf-green)] mt-1.5 flex-shrink-0" />
                        <span>{cuidado}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Distribution */}
              <div className="mb-6">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  Distribuição
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedEspecie.biomas.map((bioma) => (
                    <span key={bioma} className="px-3 py-1 rounded-full bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-sm">
                      {bioma}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  <strong>Regiões:</strong> {selectedEspecie.distribuicao.join(', ')}
                </p>
              </div>

              {/* Conservation */}
              <div className="mb-6">
                <h4 className="text-lg font-poppins font-semibold text-[var(--asf-gray-dark)] mb-3">
                  Conservação
                </h4>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${statusColors[selectedEspecie.conservacao.status]} mb-3`}>
                  <Leaf className="w-4 h-4" />
                  <span className="font-medium">
                    Status: {selectedEspecie.conservacao.status.charAt(0).toUpperCase() + selectedEspecie.conservacao.status.slice(1)}
                  </span>
                </div>
                {selectedEspecie.conservacao.ameacas.length > 0 && (
                  <div>
                    <span className="text-sm text-[var(--asf-gray-medium)]">Principais ameaças:</span>
                    <ul className="mt-2 space-y-1">
                      {selectedEspecie.conservacao.ameacas.map((ameaca, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--asf-gray-medium)] text-sm">
                          <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                          <span>{ameaca}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sources */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-[var(--asf-gray-medium)] mb-2">Fontes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEspecie.fontes.map((fonte) => (
                    <span key={fonte} className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                      {fonte}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  to="/mapa"
                  onClick={() => setSelectedEspecie(null)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                           bg-[var(--asf-green)] text-white font-medium 
                           hover:bg-[var(--asf-green-dark)] transition-colors duration-300"
                >
                  <MapPin className="w-5 h-5" />
                  Encontrar criadores desta espécie
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
