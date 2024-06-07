'use client';
import { auth } from '@/utils/firebase';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { LuCopyPlus, LuLogOut, LuPlusSquare, LuSquareStack, LuUserCircle2 } from 'react-icons/lu';

export default function Navbar() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <nav className='fixed bottom-0 left-0 w-full bg-white dark:bg-stone-900 shadow-lg flex justify-around py-5 px-10'>
      <button
        onClick={auth.signOut}
        className='nav-btn'>
        <LuLogOut className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
        <span className='hidden md:inline-block ml-1'>Logout</span>
      </button>
      <button
        onClick={() => router.push('/cards/create')}
        className='nav-btn'>
        <LuPlusSquare className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
        <span className='hidden md:inline-block ml-1'>Create Card</span>
      </button>
      <button
        onClick={() => router.push('/decks/create')}
        className='nav-btn'>
        <LuCopyPlus className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
        <span className='hidden md:inline-block ml-1'>Create Deck</span>
      </button>
      <button
        onClick={() => router.push('/cards')}
        className='nav-btn'>
        <LuSquareStack className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
        <span className='hidden md:inline-block ml-1'>All Cards</span>
      </button>
      <button
        onClick={() => router.push('/profile')}
        className='nav-btn'>
        <LuUserCircle2 className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
        <span className='hidden md:inline-block ml-1'>Profile</span>
      </button>
    </nav>
  );
}
