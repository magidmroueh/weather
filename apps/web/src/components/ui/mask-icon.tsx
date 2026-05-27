import type { CSSProperties } from 'react';
import { cn } from '~/lib/utils';

interface MaskIconProps {
  src: string;
  className?: string;
  title?: string;
}

/**
 * Renders a single-color SVG as a CSS mask filled with `currentColor`.
 * Use for the outfit-item and pet-care icons (which ship with a hard-coded
 * ink stroke) so they tint to match the surrounding text in any theme.
 */
export function MaskIcon({ src, className, title }: MaskIconProps) {
  const style: CSSProperties = {
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };
  return (
    <span
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={style}
      className={cn('inline-block', className)}
    />
  );
}
