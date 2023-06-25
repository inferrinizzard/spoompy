'use client';

import styled from 'styled-components';

const StyledNav = styled.nav`
  height: 2rem;
  width: 100%;

  display: flex;
`;

export interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return <StyledNav>{/* <input /> TODO: nav items */}</StyledNav>;
};

export default Navbar;
