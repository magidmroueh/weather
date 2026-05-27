import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '~/lib/utils';

const fieldBase =
  'h-12 w-full px-4 bg-[var(--surface-sunken)] border border-[var(--hairline)] rounded-2xl font-sans text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:border-[var(--color-primary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] transition-colors duration-150';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[14px] font-medium text-[var(--ink-soft)]">{label}</span>
      {children}
      {hint && <span className="font-sans text-[12px] text-[var(--ink-mute)]">{hint}</span>}
    </label>
  );
}

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...rest} />;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function SelectInput({ className, options, ...rest }: SelectInputProps) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, 'appearance-none pr-10', className)} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2"
        fill="none"
        stroke="var(--ink-mute)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8 L10 13 L15 8" />
      </svg>
    </div>
  );
}
