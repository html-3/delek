'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { RiFlipHorizontal2Fill, RiFlipHorizontal2Line } from 'react-icons/ri';

type Props = { frontText: string; backText: string };

export default function FlipCard({ frontText, backText }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    return () => setIsFlipped(false);
  }, [frontText, backText]);

  return (
    <div
      className='cursor-pointer flex justify-center items-center p-4'
      onClick={handleFlip}>
      {/* Add relative positioning to the card container */}
      <div className='w-64 h-96 bg-white rounded-lg shadow-lg border border-slate-300 relative'>
        <div className='flex w-full h-full justify-center items-center text-center'>
          {!isFlipped ? (
            <>
              <p className='text-2xl font-semibold select-none'>{frontText}</p>
              {/* Position the icon absolutely */}
              <RiFlipHorizontal2Fill className='w-8 h-8 text-slate-300 absolute bottom-3 left-3' />
            </>
          ) : (
            <>
              <p className='text-2xl font-semibold select-none'>{backText}</p>
              <RiFlipHorizontal2Line className='w-8 h-8 text-slate-300 absolute bottom-3 left-3' />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
