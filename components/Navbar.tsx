'use client';
import { auth } from '@/utils/firebase';
import { useRouter } from 'next/navigation';
import {
  LuCopyPlus,
  LuLogOut,
  LuPlusSquare,
  LuSquareStack,
  LuUserCircle2,
  LuDices,
} from 'react-icons/lu';

export default function Navbar() {
  const router = useRouter();

  const navOptions = [
    { onClick: auth.signOut, name: 'Logout', icon: LuLogOut },
    { onClick: () => router.push('/cards/create'), name: 'Create card', icon: LuPlusSquare },
    { onClick: () => router.push('/decks/create'), name: 'Create Deck', icon: LuCopyPlus },
    { onClick: () => router.push('/training/random'), name: 'Random Training', icon: LuDices },
    { onClick: () => router.push('/cards'), name: 'All Cards', icon: LuSquareStack },
    { onClick: () => router.push('/profile'), name: 'Profile', icon: LuUserCircle2 },
  ];

  return (
    <nav className='fixed bottom-0 left-0 w-full bg-white dark:bg-stone-900 shadow-lg flex justify-around py-5 px-10'>
      {navOptions.map((option, index) => {
        return (
          <button
            key={index}
            onClick={option.onClick}
            className='flex flex-col items-center'>
            <option.icon className='w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors' />
            <span className='hidden md:inline-block ml-1'>{option.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
