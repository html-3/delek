'use client';
import { useAuth } from '@/components/SessionProvider';
import LoginPage from './login/page';


type Props = { children: React.ReactNode };

export default function HomeTemplate({ children }: Props) {
  const { authenticated } = useAuth();
  return <>{authenticated ? children : <LoginPage />}</>;
}
