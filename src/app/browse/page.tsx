import { initTracks } from '@/redux/actions/init';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import Display from './Display';

export const Browse = async () => {
  initTracks();

  return (
    <main>
      <Preloader tracks={store.getState().playlist.tracks} />
      <Display />
    </main>
  );
};

export default Browse;
