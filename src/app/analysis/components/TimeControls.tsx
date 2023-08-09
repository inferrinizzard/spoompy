'use client';

import { useState } from 'react';
import dayjs from 'dayjs';

import { useAppDispatch } from '@/redux/client';
import {
  clearDates,
  setEndDate,
  setStartDate,
  setTimeStep,
} from '@/redux/slices/analysisSlice';
import { type DateRange, type TimeStep } from '@/types/common';

export interface TimeControlsProps {}

export const TimeControls: React.FC<TimeControlsProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<number | undefined>(undefined);

  const getRangeFromNow = (diff: {
    num: number;
    unit: dayjs.ManipulateType;
  }) => ({
    start: dayjs().subtract(diff.num, diff.unit).startOf('day').toISOString(),
    end: dayjs().toISOString(),
  });

  const setRange = (
    { start, end }: DateRange,
    timeStep: TimeStep,
    index: number,
  ) => {
    setSelected(index);
    start && dispatch(setStartDate(start));
    end && dispatch(setEndDate(end));
    dispatch(setTimeStep(timeStep));
  };

  const timeRanges = [
    {
      label: 'Last 30 Days',
      range: getRangeFromNow({ num: 30, unit: 'days' }),
      timeStep: 'day' as TimeStep,
    },
    {
      label: 'Last 90 Days',
      range: getRangeFromNow({ num: 90, unit: 'days' }),
      timeStep: 'day' as TimeStep,
    },
    {
      label: 'Last 12 Months',
      range: getRangeFromNow({ num: 12, unit: 'months' }),
      timeStep: 'month' as TimeStep,
    },
    {
      label: dayjs().year(),
      range: {
        start: dayjs().startOf('year').toISOString(),
        end: dayjs().toISOString(),
      },
      timeStep: 'month' as TimeStep,
    },
    {
      label: 'All Time',
      onClick: () => {
        dispatch(clearDates());
        dispatch(setTimeStep('year'));
      },
    },
    {
      label: 'Custom',
      onClick: () => {
        // bring up modal/popup with date picker
      },
    },
  ];

  return (
    <div>
      <h3>{'Time Range'}</h3>
      <div style={{ display: 'flex' }}>
        {timeRanges.map(({ label, range, timeStep, onClick }, i) => (
          <button
            disabled={selected == i}
            key={`time-range-${i}`}
            onClick={() => (range ? setRange(range, timeStep, i) : onClick?.())}
            type="button">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeControls;
