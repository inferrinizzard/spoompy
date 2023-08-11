import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';
import { getAllPlaylistTracks } from '@/redux/actions';

import BrowseMain from './main';

export const Browse = async () => {
  await getAllPlaylistTracks();

  return (
    <ReduxMain>
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Browse;
