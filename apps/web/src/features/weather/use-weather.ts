import { useQuery } from '@tanstack/react-query';
import type { Location } from '@weather/shared';
import { fetchWeather, weatherQueryKey } from './api';

export function useWeather(location: Location | null) {
  return useQuery({
    queryKey: location ? weatherQueryKey(location) : ['weather', 'none'],
    queryFn: () => fetchWeather(location!),
    enabled: !!location,
    staleTime: 20 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
