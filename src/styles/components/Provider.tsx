'use client';

import { ThemeProvider } from 'styled-components';

import theme from '../theme';

import GlobalStyles from './GlobalStyles';
import StyledComponentsRegistry from './Registry';

export const StyledComponentsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => (
  <StyledComponentsRegistry>
    <GlobalStyles />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledComponentsRegistry>
);

export default StyledComponentsProvider;
