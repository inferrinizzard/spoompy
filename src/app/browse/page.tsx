import { getPlaylists } from '@/api';

export const Browse = async () => {
  const playlists = getPlaylists();

  return (
    <main>
      {playlists.map((playlist, i) => (
        <div key={i}>{JSON.stringify(playlist).slice(0, 100)}</div>
      ))}
    </main>
  );
};

export default Browse;
