import { getPlaylists } from '@/api';

import AnalysisMain from './main';
import { tracksWithPlaylist } from '@/util/playlistUtils';

export const Analysis = async () => {
  const playlists = getPlaylists();
  const playlistsWithName = tracksWithPlaylist(playlists);

  return (
    <main>
      {'Analysis page'}
      <AnalysisMain playlists={playlistsWithName} />
    </main>
  );
};

export default Analysis;
