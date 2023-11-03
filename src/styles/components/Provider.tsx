'use client';

import GlobalStyles from './GlobalStyles';
import StyledComponentsRegistry from './Registry';

export const StyledComponentsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => (
  <StyledComponentsRegistry>
    <GlobalStyles />
    {children}
  </StyledComponentsRegistry>
);

export default StyledComponentsProvider;
