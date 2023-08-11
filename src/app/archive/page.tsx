import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import store from '@/redux/store';
import Preloader from '@/redux/components/Preloader';

import ArchiveMain from './main';

export const Archive = async () => {
  return (
    <main>
      <Preloader playlist={store.getState().playlist} />
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </main>
  );
};

export default Archive;
