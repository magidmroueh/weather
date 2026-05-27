import type { Location, Weather, WeatherCondition } from '@weather/shared';

export function mapWmoCode(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly_cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'cloudy';
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    uv_index: number | null;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
  };
}

export function mapOpenMeteoResponse(raw: OpenMeteoResponse, location: Location): Weather {
  return {
    location,
    current: {
      tempC: raw.current.temperature_2m,
      feelsLikeC: raw.current.apparent_temperature,
      condition: mapWmoCode(raw.current.weather_code),
      humidity: raw.current.relative_humidity_2m,
      windKph: raw.current.wind_speed_10m,
      uvIndex: raw.current.uv_index ?? 0,
    },
    today: {
      tempMinC: raw.daily.temperature_2m_min[0] ?? 0,
      tempMaxC: raw.daily.temperature_2m_max[0] ?? 0,
      precipitationChance: raw.daily.precipitation_probability_max[0] ?? 0,
      precipitationMm: raw.daily.precipitation_sum[0] ?? 0,
      sunrise: raw.daily.sunrise[0] ?? '',
      sunset: raw.daily.sunset[0] ?? '',
    },
    fetchedAt: new Date().toISOString(),
  };
}
