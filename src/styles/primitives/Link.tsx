'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledLink = styled(NextLink)<LinkProps>`
  ${(props) =>
    props.disabled &&
    `
		border: none;
		background-color: transparent;
		cursor: not-allowed;
    text-decoration: none;
  `}

  &:hover {
    color: ${({ theme }) => theme.colours.lime};
    text-decoration: underline;
  }
`;

export interface LinkProps {
  disabled?: boolean;
}

const Link: React.FC<
  PropsWithChildren<LinkProps> & NextLinkProps & ComponentPropsWithoutRef<'a'>
> = ({ disabled, children, ...props }) => {
  return (
    <StyledLink as={disabled ? 'button' : 'a'} disabled={disabled} {...props}>
      {children}
    </StyledLink>
  );
};

export default Link;
