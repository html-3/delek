'use client';
import Controller from '@/components/Training/Controller';
import getRandomCardIds from '@/functions/getRandomCardIds';
import { Card } from '@/types/Card';
import { Deck } from '@/types/Deck';
import { DeckCardRel } from '@/types/DeckCardRel';
import { Result } from '@/types/Result';
import { db } from '@/utils/firebase';
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TrainingPage({ params }: { params: { slug: string } }) {
  const [step, setStep] = useState(-1);
  const [results, setResults] = useState<Result[]>([]);
  const [deck, setDeck] = useState({} as Deck);
  const [cards, setCards] = useState<Card[]>([]);
  const router = useRouter();

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

        let cardIdList = deckCardRelSnap.docs.map((doc) => {
          const deckCardRel = doc.data() as DeckCardRel;
          return deckCardRel.cardId;
        });
        cardIdList = getRandomCardIds({ cardIdList });

        const cardQuery = query(collection(db, 'cards'), where(documentId(), 'in', cardIdList));
        const cardsSnap = await getDocs(cardQuery);

        setCards(
          cardsSnap.docs.map((doc) => {
            return { ...(doc.data() as Card), id: doc.id };
          }),
        );
      } else {
        // doc.data() will be undefined in this case
        toast.error('No such document!');
      }
    };
    getAssets();
  }, []);

  const handleSubmit = () => {
    try {
      const batch = writeBatch(db);

      results.map((result) => {
        const card = cards.find((card) => card.id == result.cardId)!;

        batch.update(doc(db, 'cards', result.cardId), {
          lapses: card.lapses + (result.lapse ? 1 : 0),
          repetitions: card.repetitions + 1,
          updatedAt: serverTimestamp(),
        } as Card);
      });

      batch.commit();
      router.push('/');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <>
      <Controller
        setStep={setStep}
        step={step}
        setResults={setResults}
        handleSubmit={handleSubmit}
        results={results}
        cards={cards!}
        deck={deck!}
      />
      <div className='flex items-center w-full gap-3'>
        <button
          className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex select-none'
          onClick={() => router.push(`/decks/update/${deck.id}`)}>
          Edit deck
        </button>
        <button
          className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex select-nonel'
          onClick={() => router.back()}>
          Back
        </button>
      </div>
    </>
  );
}
