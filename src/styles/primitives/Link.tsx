'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledLink = styled(NextLink)``;

export interface LinkProps {}

const Link: React.FC<
  PropsWithChildren<LinkProps> & NextLinkProps & ComponentPropsWithoutRef<'a'>
> = ({ children, ...props }) => <StyledLink {...props}>{children}</StyledLink>;

export default Link;
