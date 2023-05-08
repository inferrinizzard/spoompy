import { getPlaylists } from '@/api';

import Display from './Display';

export const Browse = async () => {
  const playlists = getPlaylists();

  return (
    <main>
      <Display playlists={playlists} />
    </main>
  );
};

export default Browse;
