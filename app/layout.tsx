import '../public/globals.css';
import SessionProvider from '@/components/SessionProvider';
import DarkModeProvider from '@/components/DarkModeProvider';
import { Varela_Round } from 'next/font/google';
import ToastProvider from '@/components/ToastProvider';

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
      className={`${varela_round.className} min-h-screen`}>
      <body>
        <DarkModeProvider>
          <SessionProvider>
            <ToastProvider>
              <main className='flex min-h-[90vh] flex-col items-center justify-between p-12'>
                {children}
              </main>
            </ToastProvider>
          </SessionProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
