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
    <div className='flex flex-col items-center space-y-3'>
      <h1>Create card</h1>
      <form className='space-y-3 min-w-80 max-w-[0.95vh] w-full'>
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
        className='font-bold border-2 text-amber-500 hover:text-amber-400 border-amber-500 hover:border-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={() => {
          router.back();
        }}>
        Back
      </button>
    </div>
  );
}
