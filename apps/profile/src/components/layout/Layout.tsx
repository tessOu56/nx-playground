import { type ReactNode, useEffect, useState } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress indicator with RAF throttling
  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const windowHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled =
          windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
        setScrollProgress(scrolled);
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header scrollProgress={scrollProgress} />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
