'use client';
import Navbar from '@/components/Navbar';
import { Deck } from '@/types/Deck';
import { auth, db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LuSquirrel } from 'react-icons/lu';

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

      <div className='grid grid-cols-1 xs:grid-cols-2 sm:xs:grid-cols-3 gap-2 mt-5 mb-20'>
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

      <Navbar />
    </>
  );
}
