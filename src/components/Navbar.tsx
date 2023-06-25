'use client';

import styled from 'styled-components';

import { useAppDispatch } from '@/redux/client';
import { setSearch } from '@/redux/slices/searchSlice';

import Search from './Search';

const StyledNav = styled.nav`
  height: 2rem;
  width: 100%;

  display: flex;
`;

export interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <StyledNav>
      <Search handleSearch={query => dispatch(setSearch(query))} />
      {/* <input /> TODO: date picker */}
      {/* <input /> TODO: playlist filter */}
    </StyledNav>
  );
};

export default Navbar;
