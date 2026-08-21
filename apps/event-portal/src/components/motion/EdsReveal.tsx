'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Section enter using EDS .eds-reveal / .eds-reveal-in (Wave G).
 * Purpose: list hierarchy when scrolling into view.
 */
export function EdsReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('eds-reveal-in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('eds-reveal-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`eds-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
