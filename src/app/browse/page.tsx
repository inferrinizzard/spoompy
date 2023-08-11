import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';
import store from '@/redux/store';

import BrowseMain from './main';

export const Browse = async () => {
  if (!store.getState().user.isAuthed) {
    redirect('/', RedirectType.replace);
  }

  return (
    <ReduxMain>
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Browse;
