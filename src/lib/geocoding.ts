/**
 * Serviço de geocodificação usando Nominatim (OpenStreetMap)
 * Converte endereço (cidade, estado, CEP) em coordenadas (lat, lng)
 */

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

// Cache simples para evitar requisições duplicadas
const geocodeCache = new Map<string, GeocodingResult>();

/**
 * Geocodifica um endereço brasileiro usando Nominatim API
 */
export async function geocodeEndereco(params: {
  cidade?: string;
  estado?: string;
  cep?: string;
  endereco?: string;
}): Promise<GeocodingResult | null> {
  const { cidade, estado, cep, endereco } = params;

  // Montar query de busca
  const queryParts: string[] = [];
  if (endereco) queryParts.push(endereco);
  if (cidade) queryParts.push(cidade);
  if (estado) queryParts.push(estado);
  queryParts.push('Brasil');

  const query = queryParts.join(', ');

  // Verificar cache
  if (geocodeCache.has(query)) {
    return geocodeCache.get(query)!;
  }

  // Tentar primeiro pelo CEP (mais preciso)
  if (cep) {
    const cepResult = await geocodeByCep(cep);
    if (cepResult) {
      geocodeCache.set(query, cepResult);
      return cepResult;
    }
  }

  // Fallback: Nominatim com endereço completo
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=br&limit=1`,
      {
        headers: {
          'User-Agent': 'ASFCriadores/1.0 (asfcriadores@gmail.com)',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.length === 0) return null;

    const result: GeocodingResult = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };

    geocodeCache.set(query, result);
    return result;
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return null;
  }
}

/**
 * Geocodifica usando CEP via ViaCEP + Nominatim
 */
async function geocodeByCep(cep: string): Promise<GeocodingResult | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    // Buscar endereço pelo CEP no ViaCEP
    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!viaCepResponse.ok) return null;

    const viaCepData = await viaCepResponse.json();
    if (viaCepData.erro) return null;

    // Geocodificar o endereço retornado pelo ViaCEP
    const queryParts = [
      viaCepData.logradouro,
      viaCepData.bairro,
      viaCepData.localidade,
      viaCepData.uf,
      'Brasil',
    ].filter(Boolean);

    const query = queryParts.join(', ');
    const encodedQuery = encodeURIComponent(query);

    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=br&limit=1`,
      {
        headers: {
          'User-Agent': 'ASFCriadores/1.0 (asfcriadores@gmail.com)',
        },
      }
    );

    if (!nominatimResponse.ok) return null;

    const nominatimData = await nominatimResponse.json();
    if (nominatimData.length === 0) return null;

    return {
      latitude: parseFloat(nominatimData[0].lat),
      longitude: parseFloat(nominatimData[0].lon),
      displayName: nominatimData[0].display_name,
    };
  } catch (error) {
    console.error('Erro na geocodificação por CEP:', error);
    return null;
  }
}

/**
 * Coordenadas centrais dos estados brasileiros (fallback)
 */
const estadoCoordenadas: Record<string, { lat: number; lng: number }> = {
  AC: { lat: -9.0238, lng: -70.812 },
  AL: { lat: -9.5713, lng: -36.782 },
  AM: { lat: -3.4168, lng: -65.856 },
  AP: { lat: 1.4102, lng: -51.77 },
  BA: { lat: -12.5797, lng: -41.7007 },
  CE: { lat: -5.4984, lng: -39.3206 },
  DF: { lat: -15.7998, lng: -47.8645 },
  ES: { lat: -19.1834, lng: -40.3089 },
  GO: { lat: -15.827, lng: -49.8362 },
  MA: { lat: -4.9609, lng: -45.2744 },
  MG: { lat: -18.5122, lng: -44.555 },
  MS: { lat: -20.7722, lng: -54.7852 },
  MT: { lat: -12.6819, lng: -56.9211 },
  PA: { lat: -3.4168, lng: -52.4758 },
  PB: { lat: -7.2399, lng: -36.782 },
  PE: { lat: -8.8137, lng: -36.9541 },
  PI: { lat: -7.7183, lng: -42.7289 },
  PR: { lat: -24.8946, lng: -51.55 },
  RJ: { lat: -22.9068, lng: -43.1729 },
  RN: { lat: -5.4026, lng: -36.9541 },
  RO: { lat: -11.5057, lng: -63.5806 },
  RR: { lat: 2.7376, lng: -62.0751 },
  RS: { lat: -30.0346, lng: -51.2177 },
  SC: { lat: -27.2423, lng: -50.2189 },
  SE: { lat: -10.5741, lng: -37.3857 },
  SP: { lat: -23.5505, lng: -46.6333 },
  TO: { lat: -10.1753, lng: -48.2982 },
};

/**
 * Retorna coordenadas do centro do estado (fallback)
 */
export function getEstadoCoordenadas(uf: string): { latitude: number; longitude: number } {
  const coords = estadoCoordenadas[uf.toUpperCase()];
  if (coords) {
    return { latitude: coords.lat, longitude: coords.lng };
  }
  // Centro do Brasil como último fallback
  return { latitude: -14.235, longitude: -51.925 };
}
