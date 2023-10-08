import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import AnalysisMain from './main';

export const Analysis = async () => {
  if (!store.getState().user.isAuthed) {
    redirect('/', RedirectType.replace);
  }
  return (
    <main>
      <Preloader state={store.getState()} />
      <Navbar />
      <AnalysisMain />
      <ReturnButton />
    </main>
  );
};

export default Analysis;
