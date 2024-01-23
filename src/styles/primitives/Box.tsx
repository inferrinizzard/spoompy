'use client';

import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledBox = styled.div``;

export interface BoxProps {
  as?: keyof HTMLElementTagNameMap;
}

const Box: React.FC<
  PropsWithChildren<BoxProps> & ComponentPropsWithoutRef<'div'>
> = ({ as = 'div', children, ...props }) => (
  <StyledBox as={as} {...props}>
    {children}
  </StyledBox>
);

export default Box;
