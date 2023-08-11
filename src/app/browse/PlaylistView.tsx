'use client';

import Block from '@/components/Block';
import { useAppSelector } from '@/redux/client';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

import Search from './components/Search';

export interface PlaylistViewProps {}

export const PlaylistView = () => {
  const playlists = useAppSelector(selectPlaylists);

  return (
    <>
      <div>
        <Search />
      </div>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
          gap: '1rem',
        }}>
        {Object.values(playlists).map((playlist) => (
          <Block key={playlist.id}>{playlist.name}</Block>
        ))}
      </section>
    </>
  );
};

export default PlaylistView;
