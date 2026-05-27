import { WeatherSchema, type Location, type Weather } from '@weather/shared';
import { mapOpenMeteoResponse } from './mapper';

export async function fetchWeather(location: Location): Promise<Weather> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', location.lat.toString());
  url.searchParams.set('longitude', location.lon.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,uv_index',
  );
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,weather_code',
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '1');
  url.searchParams.set('wind_speed_unit', 'kmh');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const raw = await res.json();
  return WeatherSchema.parse(mapOpenMeteoResponse(raw, location));
}

export function weatherQueryKey(location: Location) {
  return ['weather', location.lat.toFixed(2), location.lon.toFixed(2)] as const;
}
