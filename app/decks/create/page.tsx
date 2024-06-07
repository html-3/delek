'use client';

import { Deck } from '@/types/Deck';
import { auth, db } from '@/utils/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Card = {
  id: string;
  back: string;
  front: string;
  selected: boolean;
};

export default function CreateDeckPage() {
  const [deck, setDeck] = useState({} as Deck);
  const [cards, setCards] = useState<Card[]>([]);

  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const getCards = async () => {
      try {
        const cardsQuery = query(collection(db, 'cards'), where('ownerId', '==', currentUser?.uid));
        const cardsSnapshot = await getDocs(cardsQuery);
        let cardsArray: Card[] = [];

        cardsSnapshot.forEach((doc: any) => {
          const newCard = { ...doc.data(), id: doc.id, selected: false };
          if (!cards.includes(newCard)) cardsArray.push(newCard);
        });

        setCards(cardsArray);
      } catch (error) {}
    };
    getCards();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const batch = writeBatch(db);
      const deckRef = doc(collection(db, 'decks'));
      setDoc(deckRef, {
        ...deck,
        ownerId: currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      cards.map((card) => {
        batch.set(doc(collection(db, 'deckCards')), {
          cardId: card.id,
          deckId: deckRef.id,
        });
      });
      batch.commit();

      setDeck({ title: '', description: '' } as Deck);
      toast.success('Deck created successfully!');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const toggleSelection = (id: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, selected: !card.selected } : card)));
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setDeck((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className='flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto px-3'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>Create deck</h1>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 w-full'>
        <div className='flex flex-col'>
          <label
            htmlFor='title'
            className='text-gray-800 dark:text-gray-200 font-semibold mb-1'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={deck.title}
            onChange={handleChange}
            placeholder='Enter title'
            className='w-full px-4 py-2 rounded-md border-2 border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500'
            autoComplete='off'
            required
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='description'
            className='text-gray-800 dark:text-gray-200 font-semibold mb-1'>
            Description
          </label>
          <input
            type='text'
            id='description'
            name='description'
            value={deck.description}
            onChange={handleChange}
            placeholder='Enter description'
            className='w-full px-4 py-2 rounded-md border-2 border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500'
            autoComplete='off'
            required
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='description'
            className='text-gray-800 dark:text-gray-200 font-semibold mb-1'>
            Card pairs
          </label>
          <ul className='w-full'>
            {cards.map((card, index) => (
              <li
                className='my-4 w-full flex justify-between'
                key={index}>
                <div className='pr-4 w-full grid grid-cols-5'>
                  <span className='col-span-2'>{card.front}</span>
                  <span className='col-span-2'>{card.back}</span>
                  <span className='flex justify-center'>
                    <input
                      className='h-4 w-4'
                      checked={card.selected}
                      type='checkbox'
                      onChange={(e) => toggleSelection(card.id)}
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          type='submit'
          className='w-full bg-amber-500 hover:bg-amber-400 transition-colors text-white font-bold py-3 rounded-lg'>
          Confirm
        </button>
      </form>
      <button
        className='w-full border-2 border-amber-500 hover:border-amber-400 text-amber-500 hover:text-amber-400 font-bold rounded-lg py-3 px-5 transition-colors'
        onClick={() => router.back()}>
        Back
      </button>
    </div>
  );
}
