import type { Location } from '@weather/shared';

export interface GeolocationResult {
  ok: true;
  location: Location;
}

export interface GeolocationFailure {
  ok: false;
  reason: 'unsupported' | 'denied' | 'unavailable' | 'timeout';
  message: string;
}

export async function requestCurrentLocation(): Promise<GeolocationResult | GeolocationFailure> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return { ok: false, reason: 'unsupported', message: 'Geolocation not available on this device.' };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          location: {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          },
        });
      },
      (err) => {
        const reason: GeolocationFailure['reason'] =
          err.code === err.PERMISSION_DENIED
            ? 'denied'
            : err.code === err.TIMEOUT
              ? 'timeout'
              : 'unavailable';
        resolve({ ok: false, reason, message: err.message || 'Unable to read location.' });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  });
}
