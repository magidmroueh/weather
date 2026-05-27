import { useEffect, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFamilyStore } from '~/stores/family-store';
import { useWeather } from '~/features/weather/use-weather';
import { useRecommendation } from '~/features/recommendation/use-recommendation';
import { WeatherCard } from '~/components/weather-card';
import { LocationPicker } from '~/components/location-picker';
import { WeatherCardSkeleton, CardSkeleton } from '~/components/loading-skeleton';
import { MemberTabs } from '~/components/member-tabs';
import { OutfitCard } from '~/components/outfit-card';
import { PetCard } from '~/components/pet-card';
import { AppHeader } from '~/components/app-header';
import { SettingsPanel } from '~/components/settings-panel';
import { Button } from '~/components/ui/button';
import type { Member, MemberRecommendation } from '@weather/shared';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  const members = useFamilyStore((s) => s.members);
  const location = useFamilyStore((s) => s.location);
  const units = useFamilyStore((s) => s.units);
  const activeMemberId = useFamilyStore((s) => s.activeMemberId);
  const setLocation = useFamilyStore((s) => s.setLocation);
  const setActiveMember = useFamilyStore((s) => s.setActiveMember);

  const [hydrated, setHydrated] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => setHydrated(true), []);

  const showPicker = hydrated && (!location || editingLocation);
  const weatherQuery = useWeather(showPicker ? null : location);
  const weather = weatherQuery.data;

  const recommendationQuery = useRecommendation(members, weather);
  const resultsByMember = useMemo(() => {
    const map = new Map<string, MemberRecommendation>();
    recommendationQuery.data?.results.forEach((r) => map.set(r.memberId, r));
    return map;
  }, [recommendationQuery.data]);

  const activeMember = useMemo(() => {
    if (!members.length) return null;
    return members.find((m) => m.id === activeMemberId) ?? members[0]!;
  }, [members, activeMemberId]);

  useEffect(() => {
    if (activeMember && activeMember.id !== activeMemberId) {
      setActiveMember(activeMember.id);
    }
  }, [activeMember, activeMemberId, setActiveMember]);

  if (!hydrated) {
    return (
      <Shell>
        <WeatherCardSkeleton />
        <CardSkeleton />
      </Shell>
    );
  }

  return (
    <Shell
      header={
        <AppHeader
          locationLabel={location?.label || 'Pick a location'}
          onLocationClick={() => {
            if (settingsOpen) setSettingsOpen(false);
            else setEditingLocation(true);
          }}
          onSettingsClick={() => {
            setEditingLocation(false);
            setSettingsOpen((v) => !v);
          }}
          settingsOpen={settingsOpen}
        />
      }
    >
      {settingsOpen ? (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      ) : (
        <>
          {showPicker && (
            <LocationPicker
              onPick={(loc) => {
                setLocation(loc);
                setEditingLocation(false);
              }}
              onCancel={location ? () => setEditingLocation(false) : undefined}
            />
          )}

          {!showPicker && (
            <>
              {weatherQuery.isLoading && <WeatherCardSkeleton />}
              {weatherQuery.isError && (
                <article className="rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
                  <p className="m-0 font-sans text-[16px] text-[var(--ink)]">
                    Couldn't load weather right now.
                  </p>
                  <Button onClick={() => weatherQuery.refetch()} className="mt-3">
                    Try again
                  </Button>
                </article>
              )}
              {weather && <WeatherCard weather={weather} units={units} />}

              <MemberTabs
                members={members}
                activeId={activeMember?.id ?? null}
                onChange={(id) => setActiveMember(id)}
              />

              {weather && (
                <RecommendationArea
                  activeMember={activeMember}
                  resultsByMember={resultsByMember}
                  isLoading={recommendationQuery.isLoading}
                  isError={recommendationQuery.isError}
                  error={recommendationQuery.error as Error | null}
                  onRetry={() => recommendationQuery.refetch()}
                />
              )}
            </>
          )}
        </>
      )}
    </Shell>
  );
}

function Shell({
  header,
  children,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="flex w-full max-w-[420px] flex-col sm:max-w-[560px]">
        {header}
        <div className="flex flex-1 flex-col gap-4 px-5 pt-2 pb-6 sm:gap-5 sm:px-7 sm:pt-3 sm:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function RecommendationArea({
  activeMember,
  resultsByMember,
  isLoading,
  isError,
  error,
  onRetry,
}: {
  activeMember: Member | null;
  resultsByMember: Map<string, MemberRecommendation>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
}) {
  if (isLoading) return <CardSkeleton />;
  if (isError) {
    return (
      <article className="rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
        <p className="m-0 font-sans text-[16px] text-[var(--ink)]">
          Couldn't generate recommendations.
        </p>
        {error?.message && (
          <p className="mt-1 font-sans text-[12px] text-[var(--ink-mute)]">{error.message}</p>
        )}
        <Button onClick={onRetry} className="mt-3">
          Try again
        </Button>
      </article>
    );
  }
  if (!activeMember) return null;
  const result = resultsByMember.get(activeMember.id);
  if (!result) return null;
  if (activeMember.kind === 'person' && result.kind === 'person') {
    return <OutfitCard member={activeMember} recommendation={result} />;
  }
  if (activeMember.kind === 'pet' && result.kind === 'pet') {
    return <PetCard member={activeMember} recommendation={result} />;
  }
  return null;
}
