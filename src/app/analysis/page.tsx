import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';
import ReduxMain from '@/redux/components/ReduxMain';

import AnalysisMain from './main';

export const Analysis = async () => {
  return (
    <ReduxMain>
      <Navbar />
      <AnalysisMain />
      <ReturnButton />
    </ReduxMain>
  );
};

export default Analysis;
