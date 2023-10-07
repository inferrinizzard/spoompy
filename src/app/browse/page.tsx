import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import { getAllPlaylistTracks } from '@/redux/actions';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import BrowseMain from './main';

export const Browse = async () => {
  await getAllPlaylistTracks();

  return (
    <main>
      <Preloader state={store.getState()} />
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </main>
  );
};

export default Browse;
