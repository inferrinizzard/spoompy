import Navbar from '@/components/Navbar';
import ReduxMain from '@/redux/components/ReduxMain';

import ArchiveMain from './main';

export const Archive = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <ArchiveMain />
    </ReduxMain>
  );
};

export default Archive;
