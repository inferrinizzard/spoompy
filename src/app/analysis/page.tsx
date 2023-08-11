import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import store from '@/redux/store';
import Preloader from '@/redux/components/Preloader';

import AnalysisMain from './main';

export const Analysis = async () => {
  if (!store.getState().user.isAuthed) {
    redirect('/', RedirectType.replace);
  }
  return (
    <main>
      <Preloader playlist={store.getState().playlist} />
      <Navbar />
      <AnalysisMain />
      <ReturnButton />
    </main>
  );
};

export default Analysis;
