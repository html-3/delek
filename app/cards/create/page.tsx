'use client';

import { Card } from '@/types/Card';
import { auth, db } from '@/utils/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateCardPage() {
  const [card, setCard] = useState({} as Card);
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
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
      setCard({ front: '', back: '' } as Card);
      toast.success('Card created successfully!');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className='flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto px-3'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>Create card</h1>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 w-full'>
        <div className='flex flex-col'>
          <label
            htmlFor='front'
            className='text-gray-800 dark:text-gray-200 font-semibold mb-1'>
            Front-side
          </label>
          <input
            type='text'
            id='front'
            name='front'
            value={card.front}
            onChange={handleChange}
            placeholder='Enter front side of the card'
            className='w-full px-4 py-2 rounded-md border-2 border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500'
            required
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='back'
            className='text-gray-800 dark:text-gray-200 font-semibold mb-1'>
            Back-side
          </label>
          <input
            type='text'
            id='back'
            name='back'
            value={card.back}
            onChange={handleChange}
            placeholder='Enter back side of the card'
            className='w-full px-4 py-2 rounded-md border-2 border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500'
            required
          />
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
