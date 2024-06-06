'use client';
import { auth } from '@/utils/firebase';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const currentUser = auth.currentUser;

  const themeHandler = () => {
    try {
      if (theme == 'light') setTheme('dark');
      else setTheme('light');
      toast.success('Theme changed successfully!');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

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
      <button
        className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={() => router.back()}>
        Back
      </button>
    </>
  );
}
