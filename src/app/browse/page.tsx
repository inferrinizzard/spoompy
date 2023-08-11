import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import { getAllPlaylistTracks } from '@/redux/actions';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import BrowseMain from './main';

export const Browse = async () => {
  if (!store.getState().user.isAuthed) {
    redirect('/', RedirectType.replace);
  }
  await getAllPlaylistTracks();

  return (
    <main>
      <Preloader playlist={store.getState().playlist} />
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </main>
  );
};

export default Browse;
