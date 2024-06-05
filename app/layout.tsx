import '../public/globals.css';
import SessionProvider from '@/components/SessionProvider';
import DarkModeProvider from '@/components/DarkModeProvider';
import { Varela_Round } from 'next/font/google';

const varela_round = Varela_Round({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Delek',
  description: 'A simple German learning app',
};

type Props = { children: React.ReactNode };

export default async function RootLayout({ children }: Props) {
  return (
    <html
      lang='en'
      className={varela_round.className}>
      <body>
        <DarkModeProvider>
          <SessionProvider>
            <main className='flex min-h-screen flex-col items-center justify-between p-12'>
              {children}
            </main>
          </SessionProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
