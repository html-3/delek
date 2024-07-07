'use client';
import Controller from '@/components/Training/Controller';
import { Card } from '@/types/Card';
import { Deck } from '@/types/Deck';
import { Result } from '@/types/Result';
import { db } from '@/utils/firebase';
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TrainingPage() {
  const [step, setStep] = useState(-1);
  const [results, setResults] = useState<Result[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const router = useRouter();
  const deck = { title: 'Trainning Set', description: 'This is a random training deck created exclusively for you.' } as Deck;

  useEffect(() => {
    const getAssets = async () => {
      const cardQuery = query(collection(db, 'cards'), limit(10));
      const cardsSnap = await getDocs(cardQuery);

      setCards(
        cardsSnap.docs.map((doc) => {
          return { ...(doc.data() as Card), id: doc.id };
        }),
      );
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
          className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
          onClick={() => router.back()}>
          Back
        </button>
      </div>
    </>
  );
}
