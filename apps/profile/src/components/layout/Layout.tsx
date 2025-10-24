import { type ReactNode, useEffect, useState } from 'react';

import { ScrollToTop } from '../ScrollToTop';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress indicator with RAF throttling
  useEffect(() => {
    let rafId = 0;

    const calculateProgress = () => {
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = 0;
      });
    };

    // Calculate initial progress
    calculateProgress();

    // Also recalculate after DOM is fully loaded
    const timer = setTimeout(calculateProgress, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header scrollProgress={scrollProgress} />
      <main className='flex-1'>{children}</main>
      {showFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}
