// Location Service - handles all location-related API calls

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

export type LocationResult = {
  place_id: number;
  city: string;
  kommun?: string;
  lat: string;
  lon: string;
};

/**
 * Extract city and kommun from Nominatim result
 * Returns null if no city is found
 */
function extractLocationData(result: NominatimResult): LocationResult | null {
  if (!result.address) {
    return null;
  }

  const address = result.address;
  
  // Get city name (can be in city, town, or village field)
  const city = address.city || address.town || address.village;
  
  // Don't show if there's no city
  if (!city) {
    return null;
  }
  
  // Get kommun (municipality or county)
  const kommun = address.municipality || address.county;
  
  return {
    place_id: result.place_id,
    city,
    kommun: (kommun && kommun !== city) ? kommun : undefined,
    lat: result.lat,
    lon: result.lon,
  };
}

/**
 * Search for locations using OpenStreetMap Nominatim API
 * @param query Search query string
 * @param countryCode Optional country code filter (default: 'se' for Sweden)
 * @param limit Maximum number of results (default: 5)
 */
export async function searchLocations(
  query: string,
  countryCode: string = 'se',
  limit: number = 5
): Promise<LocationResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=${countryCode}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Rentify-App/1.0', // Required by Nominatim usage policy
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Location search failed: ${response.statusText}`);
    }

    const results: NominatimResult[] = await response.json();
    
    // Extract city and kommun data, filter out results with no city
    return results
      .map(extractLocationData)
      .filter((result): result is LocationResult => result !== null);
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

