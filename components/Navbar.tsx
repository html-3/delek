'use client';
import { auth } from '@/utils/firebase';
import { useRouter } from 'next/navigation';
import { LuCopyPlus, LuLogOut, LuPlusSquare, LuSquareStack, LuUserCircle2 } from 'react-icons/lu';

export default function Navbar() {
  const router = useRouter();

  return (
    <div className='fixed bottom-0 bg-inherit z-10 flex justify-around w-full py-5 px-10 bg-white'>
      <button onClick={() => auth.signOut()}>
        <LuLogOut className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
      <button onClick={() => router.push('/cards/create')}>
        <LuPlusSquare className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
      <button onClick={() => router.push('/decks/create')}>
        <LuCopyPlus className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
      <button onClick={() => router.push('/cards')}>
        <LuSquareStack className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
      <button onClick={() => router.push('/profile')}>
        <LuUserCircle2 className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
    </div>
  );
}
