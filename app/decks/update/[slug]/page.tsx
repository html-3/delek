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
    <div className='flex flex-col items-center space-y-3'>
      <h1>Update deck</h1>
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
                        onChange={() => toggleSelection(card.id)}
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
