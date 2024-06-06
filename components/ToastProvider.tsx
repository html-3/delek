'use client';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';

type Props = { children: React.ReactNode };

export default function ToastProvider({ children }: Props) {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <Toaster
        toastOptions={{
          style: {
            background: theme == 'dark' ? '#000000' : '#FFFFFF',
            color: theme != 'dark' ? '#000000' : '#FFFFFF',
          },
        }}
      />
    </>
  );
}
