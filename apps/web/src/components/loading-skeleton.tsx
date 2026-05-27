import { cn } from '~/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-[var(--color-neutral-200)]', className)} />
  );
}

export function WeatherCardSkeleton() {
  return (
    <article className="space-y-3 rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-[20px_22px_22px] shadow-[var(--shadow-md)]">
      <Skeleton className="h-3 w-28" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-14 w-24" />
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <Skeleton className="h-[92px] w-[92px] rounded-full" />
      </div>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </article>
  );
}

export function CardSkeleton() {
  return (
    <article className="space-y-3 rounded-[28px] border border-[var(--hairline)] bg-[var(--surface)] p-[18px_20px_20px] shadow-[var(--shadow-md)]">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-2/3" />
      <div className="grid grid-cols-4 gap-2.5">
        <Skeleton className="aspect-square rounded-[14px]" />
        <Skeleton className="aspect-square rounded-[14px]" />
        <Skeleton className="aspect-square rounded-[14px]" />
        <Skeleton className="aspect-square rounded-[14px]" />
      </div>
      <Skeleton className="h-3.5 w-3/4" />
    </article>
  );
}
