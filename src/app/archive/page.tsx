import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';

import ArchiveMain from './main';

export const Archive = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Archive;
