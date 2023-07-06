'use client';

import Link from 'next/link';
import styled from 'styled-components';

const StyledNav = styled.nav`
  height: 2rem;
  width: 100%;
  margin: 0.5rem;

  display: flex;
  gap: 1rem;
`;

export interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <StyledNav>
      <Link href="/">
        <h1>{'Home'}</h1>
      </Link>
      <Link href="/browse">
        <h1>{'Browse'}</h1>
      </Link>
      <Link href="/analysis">
        <h1>{'Analysis'}</h1>
      </Link>
      <Link href="/archive">
        <h1>{'Archive'}</h1>
      </Link>
    </StyledNav>
  );
};

export default Navbar;
