'use client';
import { Deck } from '@/types/Deck';
import { auth, db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LuCopyPlus, LuLogOut, LuPlusSquare, LuSquareStack, LuSquirrel, LuUserCircle2 } from 'react-icons/lu';

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);

  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const getDecks = async () => {
      try {
        const decksQuery = query(collection(db, 'decks'), where('ownerId', '==', currentUser?.uid));
        const decksSnapshot = await getDocs(decksQuery);
        let decksArray: Deck[] = [];

        decksSnapshot.forEach((doc: any) => {
          const newDeck = { ...doc.data(), id: doc.id, selected: false };
          if (!decks.includes(newDeck)) decksArray.push(newDeck);
        });

        setDecks(decksArray);
      } catch (error) {}
    };
    getDecks();
  }, []);

  return (
    <>
      <div className='flex items-end space-x-3'>
        <LuSquirrel className='h-10 w-10 hover:animate-bounce' />
        <h1>Delek</h1>
      </div>

      <div className='grid grid-cols-3 gap-2 h-full'>
        {decks.map((deck, index) => {
          return (
            <button
              className='py-4 px-6 min-w-40 rounded-lg border-amber-500 border-2 hover:text-amber-400 hover:border-amber-400 transition-colors'
              key={index}
              onClick={() => router.push(`/training/${deck.id}`)}>
              <div className='text-center'>
                <h2>{deck.title}</h2>
                <p>{deck.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className='flex justify-around w-full'>
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
    </>
  );
}
