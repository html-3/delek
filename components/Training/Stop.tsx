import { Result } from '@/types/Result';

type Props = {
  handleSubmit: () => void;
  results: Result[];
};

export default function Stop({ handleSubmit, results }: Props) {
  const totalCards = results.length;
  const totalLapses = results.reduce((sum, obj) => {
    return sum + (obj.lapse ? 1 : 0);
  }, 0);

  return (
    <>
      <h1>Practice complete!</h1>
      <p>
        {totalCards - totalLapses} / {totalCards}
      </p>
      <button
        className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex'
        onClick={handleSubmit}>
        Continue
      </button>
    </>
  );
}
