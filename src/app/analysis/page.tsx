import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import store from '@/redux/store';
import Preloader from '@/redux/components/Preloader';

import AnalysisMain from './main';

export const Analysis = async () => {
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
