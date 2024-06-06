'use client';

import { Card } from '@/types/Card';
import { auth, db } from '@/utils/firebase';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdateCardPage({ params }: { params: { slug: string } }) {
  const [card, setCard] = useState<Card>({ front: '', back: '', id: '' } as Card);
  const router = useRouter();

  useEffect(() => {
    const fetchCard = async () => {
      const cardRef = doc(db, 'cards', params.slug);
      const cardSnap = await getDoc(cardRef);

      if (cardSnap.exists()) {
        setCard(cardSnap.data() as Card);
      } else {
        toast.error('Card not found.');
        router.back();
      }
    };

    fetchCard();
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const cardRef = doc(db, 'cards', params.slug);
      await updateDoc(cardRef, {
        ...card,
        ownerId: auth.currentUser?.uid,
        updatedAt: serverTimestamp(),
      });

      toast.success('Card updated successfully!');
      router.back();
    } catch (error) {
      toast.error(`Failed to update card: ${error}`);
    }
  };

  return (
    <div className='flex flex-col items-center space-y-3'>
      <h1>Update card</h1>
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
