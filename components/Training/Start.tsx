import { Deck } from '@/types/Deck';

type Props = {
  nextStep: () => void;
  deck: Deck;
};

export default function Start({ nextStep, deck }: Props) {
  return (
    <>
      <div className='text-center'>
        <h1>{deck.title}</h1>
        <p>{deck.description}</p>
      </div>
      <button
        className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={nextStep}>
        Start
      </button>
    </>
  );
}
