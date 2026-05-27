import type { HTMLAttributes } from 'react';
import { cn } from '~/lib/utils';

type CardVariant = 'base' | 'compact' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variants: Record<CardVariant, string> = {
  base: 'rounded-[28px] p-6 shadow-[var(--shadow-md)] border border-[var(--hairline)] bg-[var(--surface)]',
  compact: 'rounded-2xl p-4 shadow-[var(--shadow-sm)] border border-[var(--hairline)] bg-[var(--surface)]',
  elevated: 'rounded-[28px] p-6 shadow-[var(--shadow-lg)] border border-[var(--hairline)] bg-[var(--surface)]',
};

export function Card({ variant = 'base', className, ...rest }: CardProps) {
  return <div className={cn(variants[variant], className)} {...rest} />;
}
