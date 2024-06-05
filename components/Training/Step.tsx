import { Card } from '@/types/Card';
import FlipCard from '../FlipCard';
import { LuCircle, LuX } from 'react-icons/lu';

type Props = {
  nextStep: () => void;
  handleChange: (change: any) => void;
  cards: Card[];
  step: number;
};

export default function Step({ step, nextStep, cards, handleChange }: Props) {
  const card = cards[step];
  console.log('card', card, step, card.id);
  return (
    <>
      <FlipCard
        frontText={card.front}
        backText={card.back}
      />
      <div className='flex justify-around w-full'>
        <button
          onClick={() => {
            handleChange({ cardId: card.id, lapse: false });
            nextStep();
          }}>
          <LuCircle className='w-10 h-10 text-blue-400 hover:scale-125 transition-transform ease-in' />
        </button>
        <button
          onClick={() => {
            handleChange({ cardId: card.id, lapse: true });
            nextStep();
          }}>
          <LuX className='w-12 h-12 text-red-400 hover:scale-125 transition-transform ease-in' />
        </button>
      </div>
    </>
  );
}
