'use client';

import { useAppSelector } from '@/redux/client';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

export interface DownloadAllProps {}

export const DownloadAll: React.FC<DownloadAllProps> = () => {
  const playlists = useAppSelector(selectPlaylists);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
      <h2>{`Total Number of Playlists: ${Object.keys(playlists).length}`}</h2>
      <button type="button">{'Download All'}</button>
      {/* TODO: downloads */}
      <button type="button">{'Download Selected'}</button>
    </div>
  );
};

export default DownloadAll;
