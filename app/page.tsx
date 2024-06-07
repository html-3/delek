'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';
import Navbar from '@/components/Navbar';
import DeckCard from '@/components/DeckCard';
import { Deck } from '@/types/Deck';
import { LuSquirrel } from 'react-icons/lu';

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
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
      } catch (error) {
        console.error('Error fetching decks: ', error);
      }
    };
    getDecks();
  }, []);

  return (
    <>
      <header className='flex items-end space-x-3 mt-5 px-4'>
        <LuSquirrel className='h-10 w-10 text-amber-500 dark:text-amber-400 hover:animate-jump' />
        <h1 className='text-4xl font-bold text-stone-900 dark:text-stone-100'>Delek</h1>
      </header>

      <main className='px-4 mt-8 mb-20'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
            />
          ))}
        </div>
      </main>

      <Navbar />
    </>
  );
}
