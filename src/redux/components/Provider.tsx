'use client';

import { Provider } from 'react-redux';

import store from '../store';

export const ReduxProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => <Provider store={store}>{children}</Provider>;

export default ReduxProvider;
