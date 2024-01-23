'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { selectSlice, setSliceIndex } from '@/redux/slices/browseSlice';
import { Button } from '@/styles/primitives';

export interface StepperProps {
  totalLength: number;
}

const Stepper: React.FC<StepperProps> = ({ totalLength }) => {
  const dispatch = useAppDispatch();

  const slice = useAppSelector(selectSlice);

  return (
    <>
      <span>
        <Button
          onClick={() => dispatch(setSliceIndex(Math.max(0, slice.index - 1)))}>
          {'Prev'}
        </Button>
      </span>
      <span>
        <Button
          onClick={() =>
            dispatch(
              setSliceIndex(
                Math.min(slice.index + 1, totalLength / slice.size),
              ),
            )
          }>
          {'Next'}
        </Button>
      </span>
      <span>
        <Button onClick={() => dispatch(setSliceIndex(0))}>{'Reset'}</Button>
      </span>
      <span>{`${slice.index * slice.size + 1} - ${
        (slice.index + 1) * slice.size
      } of ${totalLength}`}</span>
    </>
  );
};

export default Stepper;
