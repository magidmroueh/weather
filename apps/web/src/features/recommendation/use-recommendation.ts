import { useQuery } from '@tanstack/react-query';
import type { Member, Weather } from '@weather/shared';
import { getRecommendation } from './client';

export function recommendationQueryKey(members: Member[], weather: Weather | undefined) {
  const memberFingerprint = members
    .map((m) =>
      m.kind === 'person'
        ? `p:${m.id}:${m.sex}:${m.ageGroup}:${m.workContext}`
        : `a:${m.id}:${m.species}:${m.size}:${m.coat}`,
    )
    .join('|');
  const weatherFingerprint = weather
    ? `${weather.current.condition}:${Math.round(weather.current.tempC)}:${Math.round(
        weather.today.tempMaxC,
      )}:${Math.round(weather.today.tempMinC)}:${weather.today.precipitationChance}`
    : 'none';
  return ['recommendation', memberFingerprint, weatherFingerprint] as const;
}

export function useRecommendation(members: Member[], weather: Weather | undefined) {
  return useQuery({
    queryKey: recommendationQueryKey(members, weather),
    queryFn: () => getRecommendation({ members, weather: weather! }),
    enabled: members.length > 0 && !!weather,
    staleTime: 20 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
