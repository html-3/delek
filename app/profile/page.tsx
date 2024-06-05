'use client';
import { auth } from '@/utils/firebase';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LuCornerDownLeft } from 'react-icons/lu';

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const currentUser = auth.currentUser;

  const themeHandler = () => {
    if (theme == 'light') setTheme('dark');
    else setTheme('light');
  };
  console.log(`${theme == 'dark'}`);
  return (
    <>
      <div className='flex flex-col items-center space-y-4'>
        <h1>Profile</h1>
        <Image
          className='rounded-full'
          alt='User profile image'
          src={currentUser?.photoURL || ''}
          height={100}
          width={100}
        />
        <div>
          <p>{currentUser?.displayName}</p>
          <p>{currentUser?.email}</p>
          <div className='space-x-3 flex items-center'>
            <input
              className='h-4 w-4'
              type='checkbox'
              checked={theme == 'dark'}
              onChange={themeHandler}
            />
            <label>Dark mode</label>
          </div>
        </div>
      </div>
      <button onClick={() => router.back()}>
        <LuCornerDownLeft className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
    </>
  );
}
