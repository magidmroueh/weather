import { z } from 'zod';

export const SexSchema = z.enum(['male', 'female', 'unspecified']);
export const AgeGroupSchema = z.enum(['baby', 'kid', 'teen', 'adult', 'senior']);
export const WorkContextSchema = z.enum([
  'office',
  'outdoor',
  'remote',
  'school',
  'kindergarten',
  'casual',
  'retired',
]);
export const UnitsSchema = z.enum(['metric', 'imperial']);

export const PersonMemberSchema = z.object({
  id: z.string(),
  kind: z.literal('person'),
  name: z.string().min(1).max(30),
  avatar: z.string().optional(),
  sex: SexSchema,
  ageGroup: AgeGroupSchema,
  workContext: WorkContextSchema,
});

export const PetSpeciesSchema = z.enum(['dog', 'cat', 'other']);
export const PetSizeSchema = z.enum(['small', 'medium', 'large']);
export const PetCoatSchema = z.enum(['short', 'medium', 'long', 'hairless']);

export const PetMemberSchema = z.object({
  id: z.string(),
  kind: z.literal('pet'),
  name: z.string().min(1).max(30),
  avatar: z.string().optional(),
  species: PetSpeciesSchema,
  size: PetSizeSchema,
  coat: PetCoatSchema,
});

export const MemberSchema = z.discriminatedUnion('kind', [PersonMemberSchema, PetMemberSchema]);

export type Sex = z.infer<typeof SexSchema>;
export type AgeGroup = z.infer<typeof AgeGroupSchema>;
export type WorkContext = z.infer<typeof WorkContextSchema>;
export type Units = z.infer<typeof UnitsSchema>;
export type PetSpecies = z.infer<typeof PetSpeciesSchema>;
export type PetSize = z.infer<typeof PetSizeSchema>;
export type PetCoat = z.infer<typeof PetCoatSchema>;
export type PersonMember = z.infer<typeof PersonMemberSchema>;
export type PetMember = z.infer<typeof PetMemberSchema>;
export type Member = z.infer<typeof MemberSchema>;
