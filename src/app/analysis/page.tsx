import { getPlaylists } from '@/api';

export const Analysis = async () => {
  const playlists = getPlaylists();

  return <main>{'Analysis page'}</main>;
};

export default Analysis;
