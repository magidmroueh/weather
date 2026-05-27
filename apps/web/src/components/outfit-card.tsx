import type { PersonRecommendation, PersonMember } from '@weather/shared';
import {
  guessOutfitIcon,
  mascotForMember,
  mascotUrl,
  outfitIconUrl,
  type OutfitIconKey,
} from '~/lib/assets';
import { Chip } from '~/components/ui/chip';
import { MaskIcon } from '~/components/ui/mask-icon';

interface OutfitCardProps {
  member: PersonMember;
  recommendation: PersonRecommendation;
}

interface OutfitSlot {
  label: string;
  value: string;
  icon: OutfitIconKey;
}

const ACCESSORY_ICONS: { match: RegExp; icon: OutfitIconKey }[] = [
  { match: /umbrella/i, icon: 'umbrella' },
  { match: /sunglass/i, icon: 'sunglasses' },
  { match: /scarf/i, icon: 'scarf' },
  { match: /(glove|mitten)/i, icon: 'gloves' },
  { match: /\b(beanie|cap|sun ?hat|hat)\b/i, icon: 'hat' },
];

function accessoryIcon(text: string): OutfitIconKey | null {
  for (const { match, icon } of ACCESSORY_ICONS) {
    if (match.test(text)) return icon;
  }
  return null;
}

function alertSeverity(alert: string): 'warning' | 'danger' | 'neutral' {
  const a = alert.toLowerCase();
  if (/(severe|danger|extreme|frost|stay in|heavy)/.test(a)) return 'danger';
  if (/(uv|wind|cold|hot|warning|sunscreen)/.test(a)) return 'warning';
  return 'neutral';
}

export function OutfitCard({ member, recommendation }: OutfitCardProps) {
  const { outfit, rationale, alerts } = recommendation;

  const slots: OutfitSlot[] = [
    { label: outfit.top, value: outfit.top, icon: guessOutfitIcon(outfit.top, 'top') },
    {
      label: outfit.bottom,
      value: outfit.bottom,
      icon: guessOutfitIcon(outfit.bottom, 'bottom'),
    },
  ];
  if (outfit.outerwear) {
    slots.push({
      label: outfit.outerwear,
      value: outfit.outerwear,
      icon: guessOutfitIcon(outfit.outerwear, 'outerwear'),
    });
  }
  slots.push({
    label: outfit.footwear,
    value: outfit.footwear,
    icon: guessOutfitIcon(outfit.footwear, 'footwear'),
  });

  const headline = buildHeadline(outfit.outerwear, outfit.top);

  return (
    <article
      className="rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-[18px_20px_20px] shadow-[var(--shadow-md)]"
      aria-label={`Outfit recommendation for ${member.name}`}
    >
      <p className="m-0 mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-mute)]">
        {member.name} · Today
      </p>

      <div className="mb-3.5 flex items-center gap-3.5">
        <div className="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(160deg,#DCEAFB_0%,#BBD8F5_100%)] shadow-[var(--shadow-sm)]">
          <img
            src={mascotUrl(mascotForMember(member))}
            alt=""
            className="h-16 w-16"
            aria-hidden="true"
          />
        </div>
        <h2 className="m-0 font-display text-[22px] font-bold tracking-[-0.005em] text-[var(--ink)]">
          {headline}
        </h2>
      </div>

      <div className="mb-3.5 grid grid-cols-4 gap-2.5">
        {slots.map((slot, i) => (
          <div key={`${slot.icon}-${i}`}>
            <div className="flex aspect-square items-center justify-center rounded-[14px] bg-[var(--surface-sunken)] p-3 text-[var(--ink)]">
              <MaskIcon src={outfitIconUrl(slot.icon)} className="h-full w-full" />
            </div>
            <p className="-mt-0.5 text-center font-sans text-[11px] font-medium text-[var(--ink-soft)]">
              {shortLabel(slot.label)}
            </p>
          </div>
        ))}
      </div>

      {(outfit.accessories.length > 0 || alerts.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {outfit.accessories.map((a) => {
            const icon = accessoryIcon(a);
            return (
              <Chip
                key={`acc-${a}`}
                severity="neutral"
                icon={icon ? <MaskIcon src={outfitIconUrl(icon)} className="h-3.5 w-3.5" /> : null}
              >
                {a}
              </Chip>
            );
          })}
          {alerts.map((a) => (
            <Chip key={`alert-${a}`} severity={alertSeverity(a)}>
              {a}
            </Chip>
          ))}
        </div>
      )}

      {rationale && (
        <p className="m-0 font-sans text-[14px] leading-[1.5] text-[var(--ink-soft)] italic">
          {rationale}
        </p>
      )}
    </article>
  );
}

function shortLabel(text: string): string {
  return text.length > 14 ? text.slice(0, 13).trimEnd() + '…' : text;
}

function buildHeadline(outerwear: string | null, top: string): string {
  return capitalize(outerwear ?? top);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
