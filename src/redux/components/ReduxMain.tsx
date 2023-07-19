import { type PropsWithChildren } from 'react';

import { initPlaylists } from '@/redux/actions/init';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

export interface ReduxMainProps extends PropsWithChildren {}

export const ReduxMain = async ({ children }: ReduxMainProps) => {
  await initPlaylists();

  return (
    <main>
      <Preloader playlist={store.getState().playlist} />
      {children}
    </main>
  );
};

export default ReduxMain;
