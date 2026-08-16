import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

// 1. Address details structure from Nominatim API
export interface AddressDetails {
  village?: string;
  hamlet?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  state_district?: string;
  country?: string;
  country_code?: string;
}

// 2. Search result item structure
export interface LocationSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  category?: string;
  address?: AddressDetails;
}

// 3. Current GPS Location format sent to Backend
export interface CurrentLocation {
  lat: number;
  lng: number;
  locationName: string;
}

// Base URL for OpenStreetMap Nominatim API
const LOCATION_API_URL = 'https://nominatim.openstreetmap.org';

// 4. Create readable location name from address object
export const createLocationName = (address?: AddressDetails): string => {
  if (!address) return 'Current Location';

  const areaName = address.village || address.suburb || address.neighbourhood || address.hamlet;
  const cityName = address.city || address.town || address.municipality;

  if (areaName && cityName && areaName !== cityName) {
    return `${areaName}, ${cityName}`;
  }
  if (cityName) return cityName;
  if (areaName) return areaName;
  if (address.state) return address.state;
  if (address.country) return address.country;
  return 'Current Location';
};

// 5. Ask for Location Permission on Android
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (alreadyGranted) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'VIZO needs your location to set your current location.',
        buttonPositive: 'Allow',
        buttonNegative: 'Cancel',
      }
    );

    return status === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('Location permission error:', error);
    return false;
  }
};

// 6. Search location by text query
export const searchLocation = async (query: string): Promise<LocationSearchResult[]> => {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  const searchUrl = `${LOCATION_API_URL}/search?format=json&q=${encodeURIComponent(
    cleanQuery
  )}&addressdetails=1&limit=8`;

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'VIZO-App/1.0 (location search)',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed with status: ${response.status}`);
  }

  const results = (await response.json()) as LocationSearchResult[] | unknown;
  return Array.isArray(results) ? (results as LocationSearchResult[]) : [];
};

// 7. Get Address from coordinates (Reverse Geocoding)
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<LocationSearchResult> => {
  const reverseUrl = `${LOCATION_API_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

  const response = await fetch(reverseUrl, {
    headers: {
      'User-Agent': 'VIZO-App/1.0 (reverse geocoding)',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to find address: ${response.status}`);
  }

  return (await response.json()) as LocationSearchResult;
};

// 8. Get Phone's Current GPS Location
export const getCurrentLocation = async (): Promise<CurrentLocation> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw { code: 1, message: 'Permission denied' };
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const place = await getAddressFromCoordinates(latitude, longitude);

          resolve({
            lat: latitude,
            lng: longitude,
            locationName: createLocationName(place?.address),
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};