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
    <div className='flex flex-col items-center space-y-3'>
      <h1>Create deck</h1>
      <form className='space-y-3 min-w-80 max-w-[0.95vh] w-full'>
        <div className='col-span-full flex flex-col'>
          <label htmlFor='title'>Title</label>
          <input
            className='w-full rounded-md border-2 py-2 px-3 ring-gray-300 placeholder:text-gray-400'
            name='title'
            id='title'
            value={deck.title}
            onChange={handleChange}
            autoComplete='off'
          />
        </div>
        <div className='col-span-full flex flex-col'>
          <label htmlFor='description'>Description</label>
          <input
            className='w-full rounded-md border-2 py-2 px-3 ring-gray-300 placeholder:text-gray-400'
            name='description'
            id='description'
            value={deck.description}
            onChange={handleChange}
            autoComplete='off'
          />
        </div>
        <div className='col-span-full flex flex-col'>
          <label htmlFor='description'>Card pairs</label>
          <ul className='w-full'>
            {cards.map((card, index) => {
              return (
                <li
                  className='my-4 w-full flex justify-between'
                  key={index}>
                  <div className='pr-4 w-full grid grid-cols-5'>
                    <span className='col-span-2'>{card.front}</span>
                    <span className='col-span-2'>{card.back}</span>
                    <span>
                      <input
                        className='h-4 w-4'
                        checked={card.selected}
                        type='checkbox'
                        onChange={(e) => toggleSelection(card.id)}
                      />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
          onClick={handleSubmit}>
          Confirm
        </button>
      </form>

      <button
        className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={() => {
          router.back();
        }}>
        Back
      </button>
    </div>
  );
}
