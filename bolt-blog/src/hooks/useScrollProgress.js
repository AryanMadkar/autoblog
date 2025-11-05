import { useEffect, useRef } from 'react';
import { useReadingStore } from '../store';

export const useScrollProgress = (elementRef) => {
  const { setScrollPercentage } = useReadingStore();
  const rafRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!elementRef?.current) return;

        const element = elementRef.current;
        const elementRect = element.getBoundingClientRect();
        const scrollPercentage = Math.max(
          0,
          Math.min(100, (-elementRect.top / elementRect.height) * 100)
        );
        setScrollPercentage(scrollPercentage);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [setScrollPercentage, elementRef]);
};

export const useScrollToTop = () => {
  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector('[data-scroll-to-top]');
      if (button) {
        if (window.scrollY > 400) {
          button.classList.remove('opacity-0', 'pointer-events-none');
          button.classList.add('opacity-100');
        } else {
          button.classList.add('opacity-0', 'pointer-events-none');
          button.classList.remove('opacity-100');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
