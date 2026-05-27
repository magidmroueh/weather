import type { ButtonHTMLAttributes } from 'react';
import { cn } from '~/lib/utils';

type Variant = 'primary' | 'ghost' | 'destructive';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center rounded-full font-display font-semibold transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]',
  ghost:
    'bg-transparent text-[var(--ink)] hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)]',
  destructive:
    'bg-[var(--color-danger-500)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-danger-600)] active:bg-[var(--color-danger-700)]',
};

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-[16px]',
  sm: 'h-9 px-4 text-[14px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  );
}
