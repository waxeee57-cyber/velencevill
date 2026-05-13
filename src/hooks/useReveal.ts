import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLDivElement>(stagger = false) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (stagger) {
      el.querySelectorAll<HTMLElement>('.reveal').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(child);
      });
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}
