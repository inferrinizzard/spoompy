import ReduxMain from '@/redux/components/ReduxMain';

import Display from './Display';

export const Browse = async () => {
  return (
    <ReduxMain>
      <Display />
    </ReduxMain>
  );
};

export default Browse;
