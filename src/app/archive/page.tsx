import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

import ArchiveMain from './main';

export const Archive = async () => {
  return (
    <main>
      <Preloader state={store.getState()} />
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </main>
  );
};

export default Archive;
