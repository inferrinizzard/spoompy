import { getPlaylists } from '@/api';

import AnalysisMain from './main';

export const Analysis = async () => {
  const playlists = getPlaylists();

  return (
    <main>
      {'Analysis page'}
      <AnalysisMain playlists={playlists} />
    </main>
  );
};

export default Analysis;
