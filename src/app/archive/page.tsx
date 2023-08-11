import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';
import store from '@/redux/store';

import ArchiveMain from './main';

export const Archive = async () => {
  if (!store.getState().user.isAuthed) {
    redirect('/', RedirectType.replace);
  }

  return (
    <ReduxMain>
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Archive;
