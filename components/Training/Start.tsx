import { Deck } from '@/types/Deck';

type Props = {
  nextStep: () => void;
  deck: Deck;
};

export default function Start({ nextStep, deck }: Props) {
  return (
    <>
      <h1>{deck.title}</h1>
      <p>{deck.description}</p>
      <button onClick={nextStep}>Start</button>
    </>
  );
}
