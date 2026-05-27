interface AppHeaderProps {
  locationLabel: string;
  onLocationClick: () => void;
  onSettingsClick: () => void;
  settingsOpen?: boolean;
}

export function AppHeader({
  locationLabel,
  onLocationClick,
  onSettingsClick,
  settingsOpen = false,
}: AppHeaderProps) {
  return (
    <div className="flex flex-shrink-0 items-center justify-between px-5 pt-3 pb-1.5 sm:px-7 sm:pt-5">
      <button
        type="button"
        onClick={onLocationClick}
        className="flex max-w-[72%] items-center gap-2 rounded-full px-1 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        aria-label="Change location"
      >
        <PinIcon className="h-[18px] w-[18px] flex-shrink-0 text-[var(--ink-soft)] sm:h-5 sm:w-5" />
        <span className="truncate font-display text-[22px] font-bold tracking-[-0.005em] text-[var(--ink)] sm:text-[28px]">
          {locationLabel}
        </span>
      </button>
      <button
        type="button"
        onClick={onSettingsClick}
        aria-label={settingsOpen ? 'Close settings' : 'Settings'}
        aria-pressed={settingsOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink-soft)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-neutral-100)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        {settingsOpen ? <CloseIcon className="h-5 w-5" /> : <CogIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
