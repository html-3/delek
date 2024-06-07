import { useRouter } from 'next/navigation';
import { Deck } from '@/types/Deck';

interface DeckCardProps {
  deck: Deck;
}

export default function DeckCard({ deck }: DeckCardProps) {
  const router = useRouter();

  return (
    <button
      className='py-4 px-3 min-w-40 rounded-lg border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-md hover:shadow-lg'
      onClick={() => router.push(`/training/${deck.id}`)}>
      <div className='text-center'>
        <h2 className='text-xl font-semibold mb-2'>{deck.title}</h2>
        <p className='text-stone-700 dark:text-stone-400'>{deck.description}</p>
      </div>
    </button>
  );
}
