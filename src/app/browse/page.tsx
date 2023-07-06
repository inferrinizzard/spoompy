import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';

import BrowseMain from './main';

export const Browse = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Browse;
