import { Type, type Schema } from '@google/genai';
import type { RecommendationRequest } from '@weather/shared';

export function buildSystemInstruction(): string {
  return `You are a friendly, practical outfit and pet-care assistant. Given today's
weather and a list of family members (people and pets), produce a tailored
recommendation for each member.

For PEOPLE:
- Outfit fields are short noun phrases (max 6 words each).
- "outerwear" is null when not needed.
- "accessories" only includes genuinely useful items today (umbrella for
  rain, sunglasses + sunscreen note for high UV, scarf for cold, etc.).
- "rationale" is ONE short sentence explaining the key reasoning.
- "alerts" only for actionable conditions:
    UV >= 8 -> sunscreen
    precipitation chance >= 60% -> bring rain protection
    temperature <= 0C -> cold weather warning
    wind >= 40 kph -> wind warning
- Suggestions must respect each person's:
    workContext (office = business-appropriate, no shorts/flip-flops;
                 outdoor = durable, weather-protective layers;
                 remote = comfortable, casual;
                 school/kindergarten = practical, age-appropriate;
                 casual/retired = relaxed)
    ageGroup (baby/kid suggestions differ from adult; seniors may
              need extra warmth in cold)
- For families with multiple people, suggestions can complement each other
  (e.g. matching rain gear) but each member's needs come first.

For PETS:
- "walkRecommended" is false in extreme heat (>30C) or extreme cold
  (<-10C for most dogs, less for short-coated/small dogs).
- "bestWalkTime" examples: "early morning", "after sunset",
  "midday is fine", "skip outdoor today".
- "pawProtection" true when pavement is likely hot (>28C ambient) or
  there's snow/ice/salt risk.
- "coatNeeded" true for short-coated dogs in cold (<5C) or windy
  conditions. Most cats: false. Hairless: be more cautious.
- "hydrationReminder" true on hot or active days (>22C).
- "notes" can include 1-3 short practical tips.
- "rationale": ONE short sentence.
- "alerts": only for genuinely dangerous conditions
  (>32C, <-15C, severe weather).

Always include the member's exact "memberId" in each result. Set "kind" to
"person" or "pet" matching that member. Return exactly one result per member,
in the same order as the input list.

Avoid brand names. Avoid culturally-specific items unless clearly fitting.
Be warm and concise — this is a friendly family app, not a fashion magazine.`;
}

export function buildUserPrompt(req: RecommendationRequest): string {
  const { weather, members } = req;
  const { current, today, location } = weather;
  const place = location.label ?? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`;

  const weatherLines = [
    `Weather today in ${place}:`,
    `- Now: ${current.tempC.toFixed(1)}C (feels like ${current.feelsLikeC.toFixed(1)}C), ${current.condition}`,
    `- Today's range: ${today.tempMinC.toFixed(1)}C - ${today.tempMaxC.toFixed(1)}C`,
    `- Precipitation: ${today.precipitationChance}% chance, ${today.precipitationMm.toFixed(1)}mm`,
    `- Wind: ${current.windKph.toFixed(0)} kph`,
    `- UV index: ${current.uvIndex}`,
    `- Humidity: ${current.humidity}%`,
    `- Sunrise: ${today.sunrise}, sunset: ${today.sunset}`,
  ];

  const memberLines = members.map((m, i) => {
    if (m.kind === 'person') {
      return `${i + 1}. memberId=${m.id} | ${m.name} (person) — sex=${m.sex}, age=${m.ageGroup}, context=${m.workContext}`;
    }
    return `${i + 1}. memberId=${m.id} | ${m.name} (pet) — species=${m.species}, size=${m.size}, coat=${m.coat}`;
  });

  return [
    ...weatherLines,
    '',
    'Family members:',
    ...memberLines,
    '',
    'Return a JSON object with a "results" array containing one recommendation per member, in the same order.',
  ].join('\n');
}

const personResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    kind: { type: Type.STRING, enum: ['person'] },
    memberId: { type: Type.STRING },
    rationale: { type: Type.STRING },
    alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
    outfit: {
      type: Type.OBJECT,
      properties: {
        top: { type: Type.STRING },
        bottom: { type: Type.STRING },
        outerwear: { type: Type.STRING, nullable: true },
        footwear: { type: Type.STRING },
        accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['top', 'bottom', 'outerwear', 'footwear', 'accessories'],
    },
  },
  required: ['kind', 'memberId', 'rationale', 'alerts', 'outfit'],
};

const petResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    kind: { type: Type.STRING, enum: ['pet'] },
    memberId: { type: Type.STRING },
    rationale: { type: Type.STRING },
    alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
    advice: {
      type: Type.OBJECT,
      properties: {
        walkRecommended: { type: Type.BOOLEAN },
        bestWalkTime: { type: Type.STRING },
        pawProtection: { type: Type.BOOLEAN },
        coatNeeded: { type: Type.BOOLEAN },
        hydrationReminder: { type: Type.BOOLEAN },
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [
        'walkRecommended',
        'bestWalkTime',
        'pawProtection',
        'coatNeeded',
        'hydrationReminder',
        'notes',
      ],
    },
  },
  required: ['kind', 'memberId', 'rationale', 'alerts', 'advice'],
};

export const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        anyOf: [personResultSchema, petResultSchema],
      },
    },
  },
  required: ['results'],
};
