import ReduxMain from '@/redux/components/ReduxMain';

import AnalysisMain from './main';

export const Analysis = async () => {
  return (
    <ReduxMain>
      {'Analysis page'}
      <AnalysisMain />
    </ReduxMain>
  );
};

export default Analysis;
