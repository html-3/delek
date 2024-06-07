'use client';
import { Card } from '@/types/Card';
import { Deck } from '@/types/Deck';
import { DeckCardRel } from '@/types/DeckCardRel';
import { auth, db } from '@/utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdateDeckPage({ params }: { params: { slug: string } }) {
  const [deck, setDeck] = useState<Deck>({ title: '', description: '', id: '' } as Deck);
  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const getAssets = async () => {
      const deckQuery = doc(db, 'decks', params.slug);

      const deckSnap = await getDoc(deckQuery);
      if (deckSnap.exists()) {
        const deckData = { ...(deckSnap.data() as Deck), id: deckSnap.id };
        setDeck(deckData);

        const deckCardRelQuery = query(
          collection(db, 'deckCards'),
          where('deckId', '==', deckSnap.id),
        );
        const deckCardRelSnap = await getDocs(deckCardRelQuery);

        const originalDeckCards = deckCardRelSnap.docs.map((doc) => {
          const deckCardRel = { ...doc.data(), id: doc.id } as DeckCardRel;
          return deckCardRel;
        });

        const cardsQuery = query(collection(db, 'cards'), where('ownerId', '==', currentUser?.uid));
        const cardsSnapshot = await getDocs(cardsQuery);
        let cardsArray: Card[] = [];
        let originalCardsArray: Card[] = [];

        cardsSnapshot.forEach((cardSnap) => {
          const deckCard = originalDeckCards.find((deckCard) => deckCard.cardId == cardSnap.id);
          const newCard = { ...(cardSnap.data() as Card), id: cardSnap.id, selected: !!deckCard };

          if (!!deckCard) originalCardsArray.push({ ...newCard, deckCardId: deckCard.id });
          cardsArray.push(newCard); // Corrected the inclusion condition
        });

        setCards(cardsArray);
        setOriginalCards(originalCardsArray);
      } else {
        toast.error('No such document!');
      }
    };
    getAssets();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const batch = writeBatch(db);
      const deckRef = doc(db, 'decks', deck.id);
      await updateDoc(deckRef, {
        updatedAt: serverTimestamp(),
      });

      const newSelectionCards = cards.filter((card) => card.selected);
      const addedCards = newSelectionCards.filter(
        (card) => !originalCards.some((origCard) => origCard.id === card.id),
      );
      const removedCards = originalCards.filter(
        (origCard) => !newSelectionCards.some((card) => card.id === origCard.id),
      );
      addedCards.forEach((card) => {
        batch.set(
          doc(collection(db, 'deckCards')),
          {
            cardId: card.id,
            deckId: deck.id,
          },
          { merge: true },
        );
      });
      removedCards.forEach((card) => {
        batch.delete(doc(db, 'deckCards', card.deckCardId));
      });
      await batch.commit();

      toast.success('Deck updated successfully!');
      router.back();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const toggleSelection = (id: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, selected: !card.selected } : card)));
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setDeck((prev) => ({ ...prev, [e.target.name]: e.target.value || '' }));
  };

  return (
    <div className='flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto px-3'>
      <h1 className='text-3xl font-bold'>Update deck</h1>
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
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='description'
            className='font-semibold'>
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
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='description'
            className='font-semibold'>
            Card pairs
          </label>
          <ul className='w-full'>
            {cards.map((card, index) => (
              <li
                key={index}
                className='my-4 w-full flex justify-between'>
                <div className='w-full grid grid-cols-5'>
                  <span className='col-span-2'>{card.front}</span>
                  <span className='col-span-2'>{card.back}</span>
                  <span className='flex justify-center'>
                    <input
                      className='h-4 w-4'
                      checked={card.selected}
                      type='checkbox'
                      onChange={() => toggleSelection(card.id)}
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
