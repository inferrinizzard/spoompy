import Navbar from '@/components/Navbar';
import ReduxMain from '@/redux/components/ReduxMain';

import AnalysisMain from './main';

export const Analysis = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <AnalysisMain />
    </ReduxMain>
  );
};

export default Analysis;
