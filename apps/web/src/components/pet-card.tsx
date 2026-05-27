import type { PetMember, PetRecommendation } from '@weather/shared';
import { mascotForMember, mascotUrl, petIconUrl, type PetIconKey } from '~/lib/assets';
import { Chip } from '~/components/ui/chip';
import { MaskIcon } from '~/components/ui/mask-icon';

interface PetCardProps {
  member: PetMember;
  recommendation: PetRecommendation;
}

function alertSeverity(alert: string): 'warning' | 'danger' {
  return /(severe|danger|extreme|stay in|heavy|frost|>3|<-)/i.test(alert) ? 'danger' : 'warning';
}

function alertIcon(alert: string): PetIconKey | null {
  const a = alert.toLowerCase();
  if (/(hot|heat|uv|sun|sunscreen|pavement)/.test(a)) return 'hot-sun';
  if (/(cold|frost|ice|snow|freezing)/.test(a)) return 'cold-snow';
  if (/(hydrat|water)/.test(a)) return 'water-drop';
  return null;
}

export function PetCard({ member, recommendation }: PetCardProps) {
  const { advice, rationale, alerts } = recommendation;

  const ok = advice.walkRecommended;

  return (
    <article
      className="rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-[18px_20px_20px] shadow-[var(--shadow-md)]"
      aria-label={`Walk recommendation for ${member.name}`}
    >
      <p className="m-0 mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-mute)]">
        {member.name} · Today
      </p>

      <div className="mb-3 flex items-center gap-3.5">
        <div className="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(160deg,#FFE0A0_0%,#FFC96D_100%)] shadow-[var(--shadow-sm)]">
          <img
            src={mascotUrl(mascotForMember(member))}
            alt=""
            className="h-16 w-16"
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span
            className={
              ok
                ? 'inline-flex w-max items-center gap-1.5 rounded-full bg-[var(--color-success-100)] px-3 py-[5px] font-display text-[13px] font-bold text-[var(--color-success-700)] before:inline-block before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--color-success-500)] before:content-[""]'
                : 'inline-flex w-max items-center gap-1.5 rounded-full bg-[var(--color-danger-100)] px-3 py-[5px] font-display text-[13px] font-bold text-[var(--color-danger-700)] before:inline-block before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--color-danger-500)] before:content-[""]'
            }
          >
            {ok ? 'Walk recommended' : 'Skip outdoor walk'}
          </span>
          <p className="m-0 flex items-center gap-1.5 font-display text-[18px] font-bold tracking-[-0.005em] text-[var(--ink)]">
            <MaskIcon src={petIconUrl('walk-clock')} className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="min-w-0 truncate">Best time: {advice.bestWalkTime}</span>
          </p>
        </div>
      </div>

      <div className="mb-3.5 grid grid-cols-3 gap-2.5">
        <Stat
          icon="paw"
          state={advice.pawProtection ? 'no' : 'ok'}
          strong={advice.pawProtection ? '✗ Paws care' : '✓ Paws OK'}
          line={advice.pawProtection ? 'Heat/salt risk' : 'No salt today'}
        />
        <Stat
          icon="coat-jacket"
          state={advice.coatNeeded ? 'ok' : 'no'}
          strong={advice.coatNeeded ? '✓ Coat on' : '✗ Coat skip'}
          line={advice.coatNeeded ? 'Cold for the coat' : 'Mild enough'}
        />
        <Stat
          icon="water-drop"
          state={advice.hydrationReminder ? 'ok' : 'no'}
          strong={advice.hydrationReminder ? '✓ Water' : '✗ Water'}
          line={advice.hydrationReminder ? 'Bring 250 ml' : 'Cool enough'}
        />
      </div>

      {advice.notes.length > 0 && (
        <ul className="m-0 mb-3 list-none space-y-2 p-0">
          {advice.notes.slice(0, 3).map((n) => (
            <li
              key={n}
              className='relative pl-3.5 font-sans text-[13px] leading-[1.45] text-[var(--ink)] before:absolute before:top-2 before:left-0 before:h-[5px] before:w-[5px] before:rounded-full before:bg-[var(--color-primary-400)] before:content-[""]'
            >
              {n}
            </li>
          ))}
        </ul>
      )}

      {rationale && (
        <p className="m-0 font-sans text-[14px] leading-[1.5] text-[var(--ink-soft)] italic">
          {rationale}
        </p>
      )}

      {alerts.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {alerts.map((a) => {
            const icon = alertIcon(a);
            return (
              <Chip
                key={a}
                severity={alertSeverity(a)}
                icon={icon ? <MaskIcon src={petIconUrl(icon)} className="h-3.5 w-3.5" /> : null}
              >
                {a}
              </Chip>
            );
          })}
        </div>
      )}
    </article>
  );
}

function Stat({
  icon,
  state,
  strong,
  line,
}: {
  icon: PetIconKey;
  state: 'ok' | 'no';
  strong: string;
  line: string;
}) {
  const strongColor =
    state === 'ok' ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-500)]';
  return (
    <div className="relative flex flex-col items-center gap-1.5 rounded-2xl bg-[var(--surface-sunken)] px-2 py-3.5 pb-3 text-[var(--ink-soft)]">
      <MaskIcon src={petIconUrl(icon)} className="h-8 w-8" />
      <div className="text-center font-sans text-[11px] leading-[1.3] text-[var(--ink-soft)]">
        <strong className={`mb-0.5 block font-display text-[13px] font-bold ${strongColor}`}>
          {strong}
        </strong>
        {line}
      </div>
    </div>
  );
}
