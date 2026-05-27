import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '~/lib/utils';

type Severity = 'neutral' | 'warning' | 'success' | 'danger';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  severity?: Severity;
  icon?: ReactNode;
}

const severities: Record<Severity, string> = {
  neutral: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
  warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)]',
  success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
  danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-700)]',
};

export function Chip({ severity = 'neutral', icon, className, children, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[12px] font-medium',
        severities[severity],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center">{icon}</span>
      )}
      {children}
    </span>
  );
}
