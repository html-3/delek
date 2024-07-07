'use client';
import { Card } from '@/types/Card';
import { auth, db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuPenSquare } from 'react-icons/lu';

export default function GeneralCardPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const currentUser = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const fetchUserCards = async () => {
      if (!currentUser) {
        toast.error('No user is logged in.');
        return;
      }

      try {
        const cardsQuery = query(collection(db, 'cards'), where('ownerId', '==', currentUser.uid));
        const cardsSnapshot = await getDocs(cardsQuery);

        const cardsArray: Card[] = cardsSnapshot.docs.map((doc) => ({
          ...(doc.data() as Card),
          id: doc.id,
        }));

        setCards(cardsArray);
      } catch (error) {
        toast.error(`Failed to fetch cards: ${error}`);
      }
    };

    fetchUserCards();
  }, []);

  return (
    <div className='flex flex-col items-center space-y-6 mt-10 w-full max-w-4xl mx-auto px-3'>
      <h1 className='text-3xl font-bold text-stone-900 dark:text-stone-100'>Cards</h1>
      <span className='text-lg font-medium text-stone-700 dark:text-stone-300'>
        Total Cards: {cards.length}
      </span>
      <ul className='w-full divide-y divide-stone-200 dark:divide-stone-700 md:grid-cols-2 grid'>
        {cards.map((card) => (
          <li
            key={card.id}
            className='py-4 pr-3'>
            <div className='flex justify-between items-center w-full gap-6'>
              <div className='flex gap-6'>
                <span className='text-base font-bold text-stone-800 dark:text-stone-200'>
                  {card.front}
                </span>
                <span className='text-base font-medium text-stone-600 dark:text-stone-400'>
                  {card.back}
                </span>
              </div>
              <button
                className='flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-full w-8 h-8 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors'
                onClick={() => router.push(`/cards/update/${card.id}`)}>
                <LuPenSquare className='h-5 w-5 text-stone-600 dark:text-stone-300 group-hover:text-amber-500 transition-colors' />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className='w-full py-3 px-5 flex justify-center items-center bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg transition-colors'
        onClick={() => router.push('/')}>
        Back
      </button>
    </div>
  );
}
