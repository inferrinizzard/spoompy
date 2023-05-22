'use client';

import { useAppDispatch } from '@/redux/store';
import { setPlaylistFilter } from '@/redux/slices/filterSlice';

export interface FilterProps {
  options: string[];
}

const Filter: React.FC<FilterProps> = ({ options }) => {
  const dispatch = useAppDispatch();

  return (
    <select onChange={e => dispatch(setPlaylistFilter(e.target.value))}>
      <option value={''}>{'All'}</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
