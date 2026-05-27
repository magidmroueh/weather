import { z } from 'zod';

export const GeocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  admin1: z.string().optional(),
});

export type GeocodingResult = z.infer<typeof GeocodingResultSchema>;

const ResponseSchema = z.object({
  results: z.array(GeocodingResultSchema).optional(),
});

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  const parsed = ResponseSchema.parse(data);
  return parsed.results ?? [];
}

export function formatCity(r: GeocodingResult): string {
  return [r.name, r.admin1, r.country].filter(Boolean).join(', ');
}
