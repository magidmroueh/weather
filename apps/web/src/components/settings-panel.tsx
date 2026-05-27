import { useState } from 'react';
import type { Units } from '@weather/shared';
import { useFamilyStore } from '~/stores/family-store';
import { useThemePreference, type ThemePreference } from '~/lib/theme';
import { LocationPicker } from '~/components/location-picker';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const location = useFamilyStore((s) => s.location);
  const setLocation = useFamilyStore((s) => s.setLocation);
  const units = useFamilyStore((s) => s.units);
  const setUnits = useFamilyStore((s) => s.setUnits);
  const resetToDefaults = useFamilyStore((s) => s.resetToDefaults);
  const theme = useThemePreference();

  const [pickingLocation, setPickingLocation] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <Card>
        <h2 className="m-0 mb-3 font-display text-[18px] font-bold tracking-[-0.005em] text-[var(--ink)]">
          Location
        </h2>
        <div className="flex items-center justify-between gap-3">
          <p className="m-0 truncate font-sans text-[14px] text-[var(--ink-soft)]">
            {location?.label || 'Not set'}
          </p>
          <button
            type="button"
            onClick={() => setPickingLocation((v) => !v)}
            className="font-sans text-[14px] font-medium text-[var(--color-primary-600)]"
          >
            {pickingLocation ? 'Close' : 'Change'}
          </button>
        </div>
        {pickingLocation && (
          <div className="mt-4">
            <LocationPicker
              title="Change location"
              onPick={(loc) => {
                setLocation(loc);
                setPickingLocation(false);
              }}
              onCancel={() => setPickingLocation(false)}
            />
          </div>
        )}
      </Card>

      <Card>
        <h2 className="m-0 mb-3 font-display text-[18px] font-bold tracking-[-0.005em] text-[var(--ink)]">
          Units
        </h2>
        <div className="flex gap-2">
          {(['metric', 'imperial'] as Units[]).map((u) => (
            <SegmentButton key={u} active={units === u} onClick={() => setUnits(u)}>
              {u === 'metric' ? '°C · kph' : '°F · mph'}
            </SegmentButton>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="m-0 mb-3 font-display text-[18px] font-bold tracking-[-0.005em] text-[var(--ink)]">
          Theme
        </h2>
        <div className="flex gap-2">
          {(['light', 'system', 'dark'] as ThemePreference[]).map((p) => (
            <SegmentButton
              key={p}
              active={theme.preference === p}
              onClick={() => theme.setPreference(p)}
            >
              {p === 'system' ? 'Auto' : p === 'light' ? 'Light' : 'Dark'}
            </SegmentButton>
          ))}
        </div>
        <p className="mt-2 font-sans text-[12px] text-[var(--ink-mute)]">
          Auto follows your device — currently {theme.resolved}.
        </p>
      </Card>

      <Card>
        <h2 className="m-0 mb-1.5 font-display text-[18px] font-bold tracking-[-0.005em] text-[var(--color-danger-700)]">
          Reset
        </h2>
        <p className="m-0 mb-3 font-sans text-[14px] text-[var(--ink-soft)]">
          Clears your location and preferences. Default family stays.
        </p>
        {confirmReset ? (
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                resetToDefaults();
                setConfirmReset(false);
                onClose();
              }}
            >
              Yes, reset
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[var(--color-danger-200,#FFB1B1)] bg-transparent font-display text-[14px] font-semibold text-[var(--color-danger-600)]"
          >
            Reset everything
          </button>
        )}
      </Card>

      <Button variant="ghost" onClick={onClose} className="w-full">
        Done
      </Button>
    </>
  );
}

function SegmentButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-12 flex-1 rounded-full font-display text-[14px] font-semibold transition-colors',
        active
          ? 'bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-sm)]'
          : 'bg-[var(--surface-sunken)] text-[var(--ink-soft)]',
      )}
    >
      {children}
    </button>
  );
}
