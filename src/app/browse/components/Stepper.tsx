'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { selectSlice, setSliceIndex } from '@/redux/slices/browseSlice';

export interface StepperProps {
  totalLength: number;
}

const Stepper: React.FC<StepperProps> = ({ totalLength }) => {
  const dispatch = useAppDispatch();

  const slice = useAppSelector(selectSlice);

  return (
    <>
      <span>
        <button onClick={() => dispatch(setSliceIndex(Math.max(0, slice.index - 1)))}>
          {'Prev'}
        </button>
      </span>
      <span>
        <button
          onClick={() =>
            dispatch(setSliceIndex(Math.min(slice.index + 1, totalLength / slice.size)))
          }>
          {'Next'}
        </button>
      </span>
      <span>
        <button onClick={() => dispatch(setSliceIndex(0))}>{'Reset'}</button>
      </span>
      <span>{`${slice.index * slice.size + 1} - ${
        (slice.index + 1) * slice.size
      } of ${totalLength}`}</span>
    </>
  );
};

export default Stepper;
