import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import AnalysisMain from './main';

export const Analysis = async () => {
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
