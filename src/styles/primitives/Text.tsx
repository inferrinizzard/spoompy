'use client';

import { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';

type TextType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const StyledText = styled.div<TextProps>`
  ${(props) =>
    props.fontSize &&
    `font-size: ${
      Number.isNaN(props.fontSize) ? props.fontSize : props.fontSize + 'px'
    };`}
  font-weight: 400;
`;

export interface TextProps {
  as?: TextType;

  fontSize?: string | number;
}

const Text: React.FC<TextProps & ComponentPropsWithoutRef<TextType>> = ({
  as = 'p',
  children,
  ...props
}) => <StyledText as={as} {...props} />;

export default Text;
