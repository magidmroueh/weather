import { z } from 'zod';
import { MemberSchema } from './member';
import { WeatherSchema } from './weather';

export const OutfitSchema = z.object({
  top: z.string(),
  bottom: z.string(),
  outerwear: z.string().nullable(),
  footwear: z.string(),
  accessories: z.array(z.string()),
});

export const PetAdviceSchema = z.object({
  walkRecommended: z.boolean(),
  bestWalkTime: z.string(),
  pawProtection: z.boolean(),
  coatNeeded: z.boolean(),
  hydrationReminder: z.boolean(),
  notes: z.array(z.string()),
});

export const PersonRecommendationSchema = z.object({
  kind: z.literal('person'),
  memberId: z.string(),
  outfit: OutfitSchema,
  rationale: z.string(),
  alerts: z.array(z.string()),
});

export const PetRecommendationSchema = z.object({
  kind: z.literal('pet'),
  memberId: z.string(),
  advice: PetAdviceSchema,
  rationale: z.string(),
  alerts: z.array(z.string()),
});

export const MemberRecommendationSchema = z.discriminatedUnion('kind', [
  PersonRecommendationSchema,
  PetRecommendationSchema,
]);

export const RecommendationRequestSchema = z.object({
  members: z.array(MemberSchema).min(1).max(10),
  weather: WeatherSchema,
});

export const RecommendationResponseSchema = z.object({
  generatedAt: z.string(),
  results: z.array(MemberRecommendationSchema),
});

export type Outfit = z.infer<typeof OutfitSchema>;
export type PetAdvice = z.infer<typeof PetAdviceSchema>;
export type PersonRecommendation = z.infer<typeof PersonRecommendationSchema>;
export type PetRecommendation = z.infer<typeof PetRecommendationSchema>;
export type MemberRecommendation = z.infer<typeof MemberRecommendationSchema>;
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;
