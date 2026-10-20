'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Optional below-fold enter. Starts visible so a missed IntersectionObserver
 * (headless, no-JS, above-the-fold) never blanks the public catalog.
 */
export function EdsReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('eds-reveal-in');
  }, []);

  return (
    <div
      ref={ref}
      className={`eds-reveal eds-reveal-in ${className}`.trim()}
    >
      {children}
    </div>
  );
}
