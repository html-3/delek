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
    <div className='flex flex-col items-center space-y-3'>
      <h1>Cards</h1>
      <span>Total Cards: {cards.length}</span>
      <ul className='w-full'>
        {cards.map((card) => (
          <li
            key={card.id}
            className='my-4 w-full flex justify-between'>
            <div className='group w-full grid grid-cols-5 gap-3'>
              <span className='col-span-2'>{card.front}</span>
              <span className='col-span-2'>{card.back}</span>
              <button
                className='flex items-center justify-center'
                onClick={() => router.push(`/cards/update/${card.id}`)}>
                <LuPenSquare className='h-4 w-4 group-hover:text-amber-500 transition-colors' />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={() => {
          router.push('/');
        }}>
        Back
      </button>
    </div>
  );
}
