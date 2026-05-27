import { z } from 'zod';

export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  label: z.string().optional(),
});

export const WeatherConditionSchema = z.enum([
  'clear',
  'partly_cloudy',
  'cloudy',
  'fog',
  'drizzle',
  'rain',
  'snow',
  'thunderstorm',
]);

export const WeatherSchema = z.object({
  location: LocationSchema,
  current: z.object({
    tempC: z.number(),
    feelsLikeC: z.number(),
    condition: WeatherConditionSchema,
    humidity: z.number(),
    windKph: z.number(),
    uvIndex: z.number(),
  }),
  today: z.object({
    tempMinC: z.number(),
    tempMaxC: z.number(),
    precipitationChance: z.number(),
    precipitationMm: z.number(),
    sunrise: z.string(),
    sunset: z.string(),
  }),
  fetchedAt: z.string(),
});

export type Weather = z.infer<typeof WeatherSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
