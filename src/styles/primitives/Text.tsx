import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

type TextType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const StyledTextCreator = (textElement: TextType) =>
  styled(textElement)<TextProps>`
    ${(props) => props.fontSize && `font-size: ${props.fontSize};`}
  `;

export interface TextProps {
  as?: TextType;

  fontSize?: string | number;
}

const Text: React.FC<
  PropsWithChildren<TextProps> & ComponentPropsWithoutRef<TextType>
> = ({ as = 'p', children, ...props }) => {
  const StyledText = StyledTextCreator(as);

  return <StyledText {...props}>{children}</StyledText>;
};

export default Text;
