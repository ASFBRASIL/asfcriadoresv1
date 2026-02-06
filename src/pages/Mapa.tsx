import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Search, Filter, X, MapPin, Phone, Star, ChevronDown, Check } from 'lucide-react';
import { criadores as mockCriadores } from '../data/criadores';
import { isSupabaseConfigured } from '../lib/supabase';
import { useCriadores } from '../hooks/useCriadores';
import { especies, buscarEspecies, getTodasEspeciesParaFiltro } from '../data/especies';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Brazil center
const BRAZIL_CENTER: [number, number] = [-14.235, -51.925];
const BRAZIL_BOUNDS = new LatLngBounds(
  [-33.75, -73.99] as [number, number],
  [5.27, -34.79] as [number, number]
);

// Map Bounds Component
function MapBounds() {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(BRAZIL_BOUNDS);
  }, [map]);
  
  return null;
}

export function Mapa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedEspecies, setSelectedEspecies] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<('venda' | 'troca' | 'informacao')[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Buscar criadores via hook (usa Supabase se configurado, senão mock)
  const { criadores: criadoresData, isLoading } = useCriadores({
    especies: selectedEspecies.length > 0 ? selectedEspecies : undefined,
    status: selectedStatus.length > 0 ? selectedStatus : undefined,
  });

  // Usar dados do hook ou fallback para mock
  const criadores = criadoresData.length > 0 || isLoading ? criadoresData : mockCriadores;

  // Helpers para acessar dados de localização (compatível com mock e Supabase)
  const getCidade = (criador: any) => criador.localizacao?.cidade || criador.cidade || '';
  const getEstado = (criador: any) => criador.localizacao?.estado || criador.estado || '';
  const getLatitude = (criador: any) => {
    const val = criador.localizacao?.latitude ?? criador.latitude ?? 0;
    return typeof val === 'string' ? parseFloat(val) : val;
  };
  const getLongitude = (criador: any) => {
    const val = criador.localizacao?.longitude ?? criador.longitude ?? 0;
    return typeof val === 'string' ? parseFloat(val) : val;
  };
  const getAvaliacao = (criador: any) => criador.avaliacao ?? criador.avaliacao_media ?? 0;
  const getTotalAvaliacoes = (criador: any) => criador.totalAvaliacoes ?? criador.total_avaliacoes ?? 0;
  const getDescricao = (criador: any) => criador.descricao || criador.bio || '';
  const getEspeciesList = (criador: any) => criador.especies || [];

  // Search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return buscarEspecies(searchTerm);
  }, [searchTerm]);

  // All species for filter
  const todasEspecies = useMemo(() => getTodasEspeciesParaFiltro(), []);

  // Filtered creators - para dados mock, aplicar filtro local; para Supabase, o hook já filtra
  const filteredCriadores = useMemo(() => {
    if (isSupabaseConfigured()) {
      // Hook já filtra, usar direto
      return criadores;
    }
    // Filtro local para dados mockados
    return criadores.filter(criador => {
      // Filter by species
      if (selectedEspecies.length > 0) {
        const especiesList = getEspeciesList(criador);
        const hasMatchingSpecies = especiesList.some((espId: string) => 
          selectedEspecies.includes(espId)
        );
        if (!hasMatchingSpecies) return false;
      }

      // Filter by status
      if (selectedStatus.length > 0) {
        const hasMatchingStatus = criador.status.some((st: string) => 
          selectedStatus.includes(st as any)
        );
        if (!hasMatchingStatus) return false;
      }

      return true;
    });
  }, [criadores, selectedEspecies, selectedStatus]);

  // Handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle species selection
  const toggleEspecie = useCallback((especieId: string) => {
    setSelectedEspecies(prev => 
      prev.includes(especieId)
        ? prev.filter(id => id !== especieId)
        : [...prev, especieId]
    );
  }, []);

  // Toggle status selection
  const toggleStatus = useCallback((status: 'venda' | 'troca' | 'informacao') => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedEspecies([]);
    setSelectedStatus([]);
    setSearchTerm('');
  }, []);

  // Select species from search
  const selectEspecieFromSearch = useCallback((especieId: string) => {
    if (!selectedEspecies.includes(especieId)) {
      setSelectedEspecies(prev => [...prev, especieId]);
    }
    setSearchTerm('');
    setShowSearchDropdown(false);
  }, [selectedEspecies]);

  // Get species name by ID
  const getEspecieName = useCallback((id: string) => {
    const especie = especies.find(e => e.id === id);
    return especie ? especie.nomesPopulares[0] : id;
  }, []);

  // Status labels
  const statusLabels = {
    venda: 'Venda',
    troca: 'Troca',
    informacao: 'Informação',
  };

  // Status colors
  const statusColors = {
    venda: 'bg-green-100 text-green-700',
    troca: 'bg-yellow-100 text-yellow-700',
    informacao: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-asf section-padding py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-poppins font-bold text-[var(--asf-gray-dark)]">
                Mapa de Criadores
              </h1>
              <p className="text-[var(--asf-gray-medium)] text-sm mt-1">
                Explore nossa comunidade de meliponicultores em todo o Brasil
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-2xl font-bold text-[var(--asf-green)]">
                  {filteredCriadores.length}
                </div>
                <div className="text-xs text-[var(--asf-gray-medium)]">criadores ativos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar espécie por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                         focus:border-[var(--asf-green)] focus:ring-2 focus:ring-[var(--asf-green)]/20 
                         transition-all duration-300 outline-none text-sm"
              />
              
              {/* Search Dropdown */}
              {showSearchDropdown && searchTerm.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl 
                              border border-gray-100 max-h-80 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((especie) => (
                      <button
                        key={especie.id}
                        onClick={() => selectEspecieFromSearch(especie.id)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors duration-200
                                 flex items-center gap-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-[var(--asf-green)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[var(--asf-gray-dark)] text-sm">
                            {especie.nomesPopulares[0]}
                          </div>
                          <div className="text-xs text-[var(--asf-gray-medium)] italic">
                            {especie.nomeCientifico}
                          </div>
                        </div>
                        <div className="text-xs text-[var(--asf-gray-medium)]">
                          {especie.nomesPopulares.length > 1 && 
                            `+${especie.nomesPopulares.length - 1} nomes`}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-[var(--asf-gray-medium)] text-sm">
                      Nenhuma espécie encontrada
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-3 w-full flex items-center justify-between px-4 py-2.5 rounded-xl 
                       bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--asf-gray-medium)]" />
                <span className="text-sm text-[var(--asf-gray-dark)]">Filtros</span>
                {(selectedEspecies.length > 0 || selectedStatus.length > 0) && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--asf-green)] text-white text-xs">
                    {selectedEspecies.length + selectedStatus.length}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--asf-gray-medium)] transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters */}
            {showFilters && (
              <div className="mt-3 space-y-4 animate-fade-in">
                {/* Selected filters */}
                {(selectedEspecies.length > 0 || selectedStatus.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEspecies.map(espId => (
                      <span
                        key={espId}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg 
                                 bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs"
                      >
                        {getEspecieName(espId)}
                        <button
                          onClick={() => toggleEspecie(espId)}
                          className="hover:bg-[var(--asf-green)]/20 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedStatus.map(status => (
                      <span
                        key={status}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${statusColors[status]}`}
                      >
                        {statusLabels[status]}
                        <button
                          onClick={() => toggleStatus(status)}
                          className="hover:bg-black/10 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[var(--asf-gray-medium)] hover:text-[var(--asf-green)] underline"
                    >
                      Limpar todos
                    </button>
                  </div>
                )}

                {/* Species Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2">
                    Espécies ({todasEspecies.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {todasEspecies.map((esp) => (
                      <button
                        key={esp.id}
                        onClick={() => toggleEspecie(esp.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 ${
                          selectedEspecies.includes(esp.id)
                            ? 'bg-[var(--asf-green)]/10 text-[var(--asf-green)]'
                            : 'hover:bg-gray-50 text-[var(--asf-gray-dark)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedEspecies.includes(esp.id)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedEspecies.includes(esp.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="flex-1 truncate">{esp.nome}</span>
                        <span className="text-xs text-[var(--asf-gray-medium)] italic">
                          {esp.nomeCientifico.split(' ')[0]}.
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--asf-gray-dark)] mb-2">Status</h4>
                  <div className="space-y-1">
                    {(['venda', 'troca', 'informacao'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                 transition-colors duration-200 capitalize ${
                          selectedStatus.includes(status)
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedStatus.includes(status)
                            ? 'bg-[var(--asf-green)] border-[var(--asf-green)]'
                            : 'border-gray-300'
                        }`}>
                          {selectedStatus.includes(status) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`flex-1 ${statusColors[status]}`}>
                          {statusLabels[status]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Creators List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCriadores.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredCriadores.map((criador) => (
                  <div key={criador.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-[var(--asf-green)]">
                          {criador.nome.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[var(--asf-gray-dark)] truncate">
                            {criador.nome}
                          </h4>
                          {criador.verificado && (
                            <span className="px-1.5 py-0.5 rounded bg-[var(--asf-green)]/10 text-[var(--asf-green)] text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[var(--asf-gray-medium)] mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {getCidade(criador)}, {getEstado(criador)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[var(--asf-yellow-dark)] mt-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{getAvaliacao(criador)}</span>
                          <span className="text-[var(--asf-gray-medium)]">
                            ({getTotalAvaliacoes(criador)} avaliações)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getEspeciesList(criador).slice(0, 3).map((espId: string) => (
                            <span
                              key={espId}
                              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                            >
                              {getEspecieName(espId)}
                            </span>
                          ))}
                          {getEspeciesList(criador).length > 3 && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                              +{getEspeciesList(criador).length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {criador.status.map((status) => (
                            <span
                              key={status}
                              className={`px-2 py-0.5 rounded-full text-xs ${statusColors[status]}`}
                            >
                              {statusLabels[status]}
                            </span>
                          ))}
                        </div>
                        <a
                          href={`https://wa.me/${criador.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg 
                                   bg-green-500 text-white text-sm hover:bg-green-600 
                                   transition-colors duration-300"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Contato
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-[var(--asf-gray-dark)] mb-2">
                  Nenhum criador encontrado
                </h3>
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  Tente ajustar seus filtros ou buscar por outra espécie
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-[var(--asf-green)] text-white text-sm
                           hover:bg-[var(--asf-green-dark)] transition-colors duration-300"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative h-[50vh] lg:h-auto">
          <MapContainer
            center={BRAZIL_CENTER}
            zoom={4}
            className="w-full h-full"
            minZoom={4}
            maxBounds={BRAZIL_BOUNDS}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBounds />
            {filteredCriadores.map((criador) => (
              <Marker
                key={criador.id}
                position={[getLatitude(criador), getLongitude(criador)]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center">
                        <span className="font-semibold text-[var(--asf-green)]">
                          {criador.nome.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--asf-gray-dark)]">{criador.nome}</h4>
                        <div className="flex items-center gap-1 text-xs text-[var(--asf-gray-medium)]">
                          <Star className="w-3 h-3 fill-[var(--asf-yellow)] text-[var(--asf-yellow)]" />
                          {getAvaliacao(criador)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--asf-gray-medium)] mb-2 line-clamp-2">
                      {getDescricao(criador)}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {getEspeciesList(criador).slice(0, 2).map((espId: string) => (
                        <span
                          key={espId}
                          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                        >
                          {getEspecieName(espId)}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`https://wa.me/${criador.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 
                               rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 
                               transition-colors duration-300"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-72 
                        bg-white rounded-xl shadow-lg p-4 z-[400]">
            <h4 className="font-medium text-[var(--asf-gray-dark)] mb-3">Como funciona o mapa?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--asf-green)]">1</span>
                </div>
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  <strong className="text-[var(--asf-gray-dark)]">Filtre por espécie</strong>
                  <br />
                  Selecione as espécies de abelhas que você procura no painel de filtros.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--asf-green)]">2</span>
                </div>
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  <strong className="text-[var(--asf-gray-dark)]">Encontre criadores</strong>
                  <br />
                  Explore o mapa e clique nos marcadores para ver informações dos criadores.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--asf-green)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--asf-green)]">3</span>
                </div>
                <p className="text-sm text-[var(--asf-gray-medium)]">
                  <strong className="text-[var(--asf-gray-dark)]">Entre em contato</strong>
                  <br />
                  Use o botão do WhatsApp para conversar diretamente com o criador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
