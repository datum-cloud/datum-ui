import * as React from 'react';

/**
 * Lightweight theme detection hook for shadcn components.
 * Detects dark mode via the `dark` class on <html> (Tailwind convention)
 * or falls back to prefers-color-scheme media query.
 */
export function useTheme(): { resolvedTheme: 'light' | 'dark' } {
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const detect = (): 'light' | 'dark' => {
      if (document.documentElement.classList.contains('dark')) return 'dark';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    };

    setResolvedTheme(detect());

    const observer = new MutationObserver(() => setResolvedTheme(detect()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolvedTheme(detect());
    mql.addEventListener('change', onChange);

    return () => {
      observer.disconnect();
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return { resolvedTheme };
}
