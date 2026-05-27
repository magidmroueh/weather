import type { Weather, Units } from '@weather/shared';
import { weatherIconUrl } from '~/lib/assets';
import { formatTemp, formatWindSpeed } from '~/lib/format';

interface WeatherCardProps {
  weather: Weather;
  units: Units;
}

const CONDITION_DESCRIPTION: Record<string, string> = {
  clear: 'Clear and bright today.',
  partly_cloudy: 'A mix of sun and clouds.',
  cloudy: 'Overcast all day.',
  fog: 'Misty start, may take time to lift.',
  drizzle: 'Light drizzle on and off.',
  rain: 'Steady rain expected.',
  snow: 'Snow showers — pack a coat.',
  thunderstorm: 'Thunderstorms — best to stay indoors.',
};

function timeSince(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(diffMs / 60000));
  if (m < 1) return 'Just now';
  if (m === 1) return 'Updated 1 min ago';
  if (m < 60) return `Updated ${m} min ago`;
  const h = Math.round(m / 60);
  return `Updated ${h} h ago`;
}

export function WeatherCard({ weather, units }: WeatherCardProps) {
  const { current, today } = weather;
  const desc = CONDITION_DESCRIPTION[current.condition] ?? '';

  return (
    <article
      className={`wx wx--${current.condition} relative overflow-hidden rounded-[28px] p-[20px_22px_22px] shadow-[var(--shadow-md)] sm:rounded-[36px] sm:p-[26px_28px_28px] lg:p-[32px_36px_34px]`}
      aria-label="Current weather"
    >
      <p className="m-0 mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] opacity-65 sm:text-[12px]">
        {timeSince(weather.fetchedAt)}
      </p>
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="m-0 font-display text-[64px] leading-none font-bold tracking-[-0.02em] tabular-nums sm:text-[88px] lg:text-[104px]">
            {formatTemp(current.tempC, units)}
          </p>
          <p className="mt-1 font-sans text-[13px] font-medium opacity-80 sm:mt-2 sm:text-[15px]">
            Feels like {formatTemp(current.feelsLikeC, units)} · H {formatTemp(today.tempMaxC, units)} L{' '}
            {formatTemp(today.tempMinC, units)}
          </p>
          {desc && (
            <p className="mt-[10px] max-w-[200px] font-sans text-[14px] leading-[1.45] sm:mt-3 sm:max-w-[260px] sm:text-[16px]">
              {desc}
            </p>
          )}
        </div>
        <div className="-mt-1.5 -mr-1.5 h-[92px] w-[92px] flex-shrink-0 sm:h-[120px] sm:w-[120px] lg:h-[140px] lg:w-[140px]">
          <img
            src={weatherIconUrl(current.condition)}
            alt=""
            className="h-full w-full"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/40 px-1.5 py-3 backdrop-blur-sm sm:mt-6 sm:gap-3 sm:rounded-[20px] sm:px-3 sm:py-4">
        <Stat num={`${Math.round(today.precipitationChance)}%`} label="precip" />
        <Stat num={formatWindSpeed(current.windKph, units)} label="wind" />
        <Stat num={`UV ${Math.round(current.uvIndex)}`} label={uvLabel(current.uvIndex)} />
      </div>
    </article>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <span className="font-display text-[18px] font-bold tracking-[-0.005em] tabular-nums sm:text-[22px]">
        {num}
      </span>
      <span className="font-sans text-[11px] font-medium opacity-80 sm:text-[12px]">{label}</span>
    </div>
  );
}

function uvLabel(uv: number): string {
  if (uv < 3) return 'low';
  if (uv < 6) return 'moderate';
  if (uv < 8) return 'high';
  if (uv < 11) return 'very high';
  return 'extreme';
}
