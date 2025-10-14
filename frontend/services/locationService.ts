// Location Service - handles all location-related API calls

export type LocationResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

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
      )}&countrycodes=${countryCode}&limit=${limit}`,
      {
        headers: {
          'User-Agent': 'Rentify-App/1.0', // Required by Nominatim usage policy
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Location search failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

