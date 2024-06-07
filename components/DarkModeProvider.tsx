'use client';
import { ThemeProvider } from 'next-themes';

type Props = { children: React.ReactNode };

export default function DarkModeProvider({ children }: Props) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem>
      {children}
    </ThemeProvider>
  );
}
