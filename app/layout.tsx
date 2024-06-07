import '../public/globals.css';
import SessionProvider from '@/components/SessionProvider';
import ToastProvider from '@/components/ToastProvider';
import { Varela_Round } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import DarkModeProvider from '@/components/DarkModeProvider';

const varela_round = Varela_Round({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Delek',
  description: 'A simple German learning app',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
  },
  manifest: 'manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  colorScheme: 'normal',
};

type Props = { children: React.ReactNode };

export default async function RootLayout({ children }: Props) {
  return (
    <html
      suppressHydrationWarning
      lang='en'
      className={`${varela_round.className} min-h-screen`}>
      <body>
        <DarkModeProvider>
          <SessionProvider>
            <ToastProvider>
              <main className='flex flex-col items-center justify-between m-10 gap-4'>
                {children}
              </main>
            </ToastProvider>
          </SessionProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
