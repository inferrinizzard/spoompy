import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import store from '@/redux/store';

import ArchiveMain from './main';

export const Archive = async () => {
  if (!store.getState().user.isAuthed) {
    console.log('Redirecting from Archive back to Home');
    redirect('/', RedirectType.replace);
  }

  return (
    <main>
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </main>
  );
};

export default Archive;
