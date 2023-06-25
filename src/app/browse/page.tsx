import ReduxMain from '@/redux/components/ReduxMain';

import BrowseMain from './main';

export const Browse = async () => {
  return (
    <ReduxMain>
      <BrowseMain />
    </ReduxMain>
  );
};

export default Browse;
