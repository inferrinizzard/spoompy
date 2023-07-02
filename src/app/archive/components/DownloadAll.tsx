'use client';

import { useAppSelector } from '@/redux/client';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

export interface DownloadAllProps {}

export const DownloadAll: React.FC<DownloadAllProps> = () => {
  const playlists = useAppSelector(selectPlaylists);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
      <h2>{`Total Number of Playlists: ${playlists.length}`}</h2>
      <button>{'Download All'}</button>
      {/* TODO: downloads */}
      <button>{'Download Selected'}</button>
    </div>
  );
};

export default DownloadAll;
