'use client';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';

type Props = { children: React.ReactNode };

export default function ToastProvider({ children }: Props) {
  const { theme } = useTheme();

  const toastStyle = {
    style: {
      background: theme === 'dark' ? '#19171c' : '#ffffff',
      color: theme === 'dark' ? '#D1D5DB' : '#1f2937',
    },
  };

  return (
    <>
      {children}
      <Toaster toastOptions={toastStyle} />
    </>
  );
}
