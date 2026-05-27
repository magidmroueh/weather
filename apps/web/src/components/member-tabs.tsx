import type { Member } from '@weather/shared';
import { mascotForMember, mascotUrl } from '~/lib/assets';
import { cn } from '~/lib/utils';

interface MemberTabsProps {
  members: Member[];
  activeId: string | null;
  onChange: (id: string) => void;
}

export function MemberTabs({ members, activeId, onChange }: MemberTabsProps) {
  if (members.length === 0) return null;
  return (
    <div role="tablist" className="flex w-full items-stretch justify-between gap-1 py-1">
      {members.map((m) => {
        const active = m.id === activeId;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.id)}
            className={cn(
              'flex min-w-0 flex-1 basis-0 flex-col items-center gap-1.5 rounded-[24px] px-1 py-2.5 pb-3 transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
              active
                ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                : 'bg-transparent text-[var(--ink-soft)] hover:bg-[var(--color-neutral-100)]',
            )}
          >
            <img
              src={mascotUrl(mascotForMember(m))}
              alt=""
              className={cn(
                'h-12 w-12 transition-opacity duration-150',
                !active && 'opacity-75',
              )}
            />
            <span className="max-w-full truncate font-display text-[13px] font-semibold">
              {m.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
