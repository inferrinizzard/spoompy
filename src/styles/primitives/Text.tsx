'use client';

import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

type TextType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const StyledText = styled.div<TextProps>`
  ${(props) => props.fontSize && `font-size: ${props.fontSize};`}
`;

export interface TextProps {
  as?: TextType;

  fontSize?: string | number;
}

const Text: React.FC<
  PropsWithChildren<TextProps> & ComponentPropsWithoutRef<TextType>
> = ({ as = 'p', children, ...props }) => (
  <StyledText as={as} {...props}>
    {children}
  </StyledText>
);

export default Text;
