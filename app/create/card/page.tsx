'use client';

import { Card } from '@/types/Card';
import { auth, db } from '@/utils/firebase';
import { collection, doc, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuCornerDownLeft } from 'react-icons/lu';

export default function CreateCardPage() {
  const [card, setCard] = useState({} as Card);
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newCard = doc(collection(db, 'cards'));
    await setDoc(newCard, {
      ...card,
      ownerId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lapses: 0,
      repetitions: 0,
      description: '',
    });
    setCard({} as Card);
  };

  return (
    <>
      <h1>Create card</h1>
      <form className='space-y-3'>
        <div className='col-span-full flex flex-col'>
          <label htmlFor='front'>Front-side</label>
          <input
            className='w-full rounded-md border-2 py-2 px-3 ring-gray-300 placeholder:text-gray-400'
            name='front'
            id='front'
            value={card.front}
            onChange={handleChange}
          />
        </div>
        <div className='col-span-full flex flex-col'>
          <label htmlFor='back'>Back-side</label>
          <input
            className='w-full rounded-md border-2 py-2 px-3 ring-gray-300 placeholder:text-gray-400'
            name='back'
            id='back'
            value={card.back}
            onChange={handleChange}
          />
        </div>
        <button
          className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
          onClick={handleSubmit}>
          Confirm
        </button>
      </form>
      <button
        className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={() => {
          router.back();
        }}>
        <LuCornerDownLeft className='w-8 h-8 hover:text-slate-500 transition-colors' />
      </button>
    </>
  );
}
