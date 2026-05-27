import type { Member, WeatherCondition } from '@weather/shared';

export type MascotKey =
  | 'dad'
  | 'mom'
  | 'son'
  | 'daughter'
  | 'baby'
  | 'grandparent'
  | 'dog'
  | 'cat';

export function mascotUrl(key: MascotKey): string {
  return `/assets/mascots/${key}.svg`;
}

export function weatherIconUrl(condition: WeatherCondition): string {
  return `/assets/weather/${condition}.svg`;
}

export type OutfitIconKey =
  | 'top'
  | 'tshirt'
  | 'outerwear'
  | 'bottom'
  | 'shorts'
  | 'footwear'
  | 'boots'
  | 'hat'
  | 'scarf'
  | 'gloves'
  | 'umbrella'
  | 'sunglasses';

export function outfitIconUrl(key: OutfitIconKey): string {
  return `/assets/outfit-items/${key}.svg`;
}

export type PetIconKey =
  | 'paw'
  | 'water-drop'
  | 'coat-jacket'
  | 'hot-sun'
  | 'cold-snow'
  | 'walk-clock';

export function petIconUrl(key: PetIconKey): string {
  return `/assets/pet-care/${key}.svg`;
}

// Order matters: more specific phrases first. "hoodie"/"jacket"/"coat" must
// match outerwear BEFORE generic head-covering words trigger the hat icon.
const TEXT_KEYWORDS: { match: RegExp; icon: OutfitIconKey }[] = [
  { match: /umbrella/i, icon: 'umbrella' },
  { match: /sunglass/i, icon: 'sunglasses' },
  { match: /(coat|jacket|parka|windbreaker|raincoat|hoodie|sweater|cardigan|blazer|vest|fleece)/i, icon: 'outerwear' },
  { match: /scarf/i, icon: 'scarf' },
  { match: /(glove|mitten)/i, icon: 'gloves' },
  { match: /\b(beanie|cap|sun ?hat|hat)\b/i, icon: 'hat' },
  { match: /boot/i, icon: 'boots' },
  { match: /(sneaker|shoe|trainer|sandal|loafer|flip)/i, icon: 'footwear' },
  { match: /short/i, icon: 'shorts' },
  { match: /(pant|jean|trouser|legging|skirt|chino|slack)/i, icon: 'bottom' },
  { match: /(t-?shirt|tee|tank|polo)/i, icon: 'tshirt' },
  { match: /(long-?sleeve|shirt|blouse|sweat|jumper|top)/i, icon: 'top' },
];

export function guessOutfitIcon(text: string, fallback: OutfitIconKey): OutfitIconKey {
  for (const { match, icon } of TEXT_KEYWORDS) {
    if (match.test(text)) return icon;
  }
  return fallback;
}

export function mascotForMember(m: Member): MascotKey {
  if (m.kind === 'pet') {
    if (m.species === 'cat') return 'cat';
    return 'dog';
  }
  if (m.ageGroup === 'baby') return 'baby';
  if (m.ageGroup === 'senior') return 'grandparent';
  if (m.ageGroup === 'kid' || m.ageGroup === 'teen') {
    return m.sex === 'male' ? 'son' : 'daughter';
  }
  return m.sex === 'male' ? 'dad' : 'mom';
}
