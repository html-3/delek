'use client';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

type Props = { children: React.ReactNode };

export default function DarkModeProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }
  return <ThemeProvider>{children}</ThemeProvider>;
}
