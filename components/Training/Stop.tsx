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
      <button onClick={handleSubmit}>Continue</button>
    </>
  );
}
