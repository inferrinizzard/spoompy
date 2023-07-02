import ReduxMain from '@/redux/components/ReduxMain';

import ArchiveMain from './main';

export const Archive = async () => {
  return (
    <ReduxMain>
      <ArchiveMain />
    </ReduxMain>
  );
};

export default Archive;
