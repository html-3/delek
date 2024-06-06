import '../public/globals.css';
import SessionProvider from '@/components/SessionProvider';
import ToastProvider from '@/components/ToastProvider';
import { Varela_Round } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const varela_round = Varela_Round({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Delek',
  description: 'A simple German learning app',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
  },
};

type Props = { children: React.ReactNode };

export default async function RootLayout({ children }: Props) {
  return (
    <html
      suppressHydrationWarning
      lang='en'
      className={`${varela_round.className} min-h-screen`}>
      <body>
        <ThemeProvider>
          <SessionProvider>
            <ToastProvider>
              <main className='flex flex-col items-center justify-between m-10 gap-4'>
                {children}
              </main>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
