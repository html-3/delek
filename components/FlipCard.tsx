'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = { frontText: string; backText: string };

export default function FlipCard({ frontText, backText }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };
  return (
    <div className='cursor-pointer'>
      <div
        className='flip-card w-64 h-96'
        onClick={handleFlip}>
        <motion.div
          className='flip-card-inner w-full h-full'
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.2, damping: 1000 }}
          onAnimationComplete={() => {
            setIsAnimating(false);
          }}>
          <div className='rounded-lg border-slate-500 shadow-sm border-2 flip-card-front w-full h-full justify-center items-center flex'>
            <p className='text-2xl'>{frontText}</p>
          </div>
          <div className='rounded-lg border-slate-500 shadow-sm border-2 flip-card-back w-full h-full justify-center items-center flex'>
            <p className='text-2xl'>{backText}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
