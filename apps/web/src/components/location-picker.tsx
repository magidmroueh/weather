import { useEffect, useRef, useState } from 'react';
import type { Location } from '@weather/shared';
import { requestCurrentLocation } from '~/lib/geolocation';
import { searchCities, formatCity, type GeocodingResult } from '~/features/geocoding/api';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Field, TextInput } from '~/components/ui/input';

interface LocationPickerProps {
  onPick: (location: Location) => void;
  onCancel?: () => void;
  initialQuery?: string;
  title?: string;
}

export function LocationPicker({
  onPick,
  onCancel,
  initialQuery = '',
  title = 'Set your location',
}: LocationPickerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    const t = setTimeout(() => {
      searchCities(trimmed, ctrl.signal)
        .then((r) => setResults(r))
        .catch((e) => {
          if ((e as Error).name !== 'AbortError') setResults([]);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  async function useDeviceLocation() {
    setBusy(true);
    setGeoError(null);
    const result = await requestCurrentLocation();
    setBusy(false);
    if (result.ok) {
      onPick({ ...result.location, label: 'Current location' });
    } else {
      setGeoError(result.message);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="m-0 font-display text-[22px] font-bold tracking-[-0.005em] text-[var(--ink)]">
          {title}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[14px] font-medium text-[var(--color-primary-600)]"
          >
            Cancel
          </button>
        )}
      </div>

      <Button
        onClick={useDeviceLocation}
        disabled={busy}
        className="mt-4 w-full"
      >
        {busy ? 'Locating…' : 'Use my location'}
      </Button>

      {geoError && (
        <p className="mt-2 font-sans text-[12px] text-[var(--color-danger-600)]">
          {geoError} Try searching for your city instead.
        </p>
      )}

      <div className="mt-4">
        <Field label="Or search for a city">
          <TextInput
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Berlin, Germany"
          />
        </Field>
        {loading && (
          <p className="mt-2 font-sans text-[12px] text-[var(--ink-mute)]">Searching…</p>
        )}
        {!loading && results.length > 0 && (
          <ul className="mt-2 divide-y divide-[var(--hairline)] overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface)]">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() =>
                    onPick({
                      lat: r.latitude,
                      lon: r.longitude,
                      label: formatCity(r),
                    })
                  }
                  className="block w-full px-4 py-3 text-left font-sans text-[14px] text-[var(--ink)] hover:bg-[var(--color-neutral-100)]"
                >
                  {formatCity(r)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
