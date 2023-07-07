'use client';

import { useAppDispatch } from '@/redux/client';
import { setSearch } from '@/redux/slices/browseSlice';

export interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <input type="search" placeholder="Search" onChange={e => dispatch(setSearch(e.target.value))} />
  );
};

export default Search;
