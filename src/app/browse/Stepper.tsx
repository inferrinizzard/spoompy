'use client';

export interface StepperProps {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  stepSize: number;
  totalLength: number;
}

const Stepper: React.FC<StepperProps> = ({ index, setIndex, stepSize, totalLength }) => {
  return (
    <>
      <span>
        <button onClick={() => setIndex(prev => Math.max(0, prev - 1))}>{'Prev'}</button>
      </span>
      <span>
        <button onClick={() => setIndex(prev => Math.min(prev + 1, totalLength / stepSize))}>
          {'Next'}
        </button>
      </span>
      <span>
        <button onClick={() => setIndex(0)}>{'Reset'}</button>
      </span>
      <span>{`${index * stepSize + 1} - ${(index + 1) * stepSize} of ${totalLength}`}</span>
    </>
  );
};

export default Stepper;
