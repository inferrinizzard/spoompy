import Navbar from '@/components/Navbar';
import ReduxMain from '@/redux/components/ReduxMain';

import BrowseMain from './main';

export const Browse = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <BrowseMain />
    </ReduxMain>
  );
};

export default Browse;
