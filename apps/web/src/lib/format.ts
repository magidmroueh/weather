import type { Units } from '@weather/shared';

export function formatTemp(tempC: number, units: Units): string {
  if (units === 'imperial') {
    const f = Math.round(tempC * (9 / 5) + 32);
    return `${f}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatWindSpeed(kph: number, units: Units): string {
  if (units === 'imperial') {
    const mph = Math.round(kph * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kph)} kph`;
}
