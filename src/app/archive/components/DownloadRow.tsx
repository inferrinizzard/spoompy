'use client';

import Image from 'next/image';

import { download } from '../util/download';

export interface DownloadRowProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

export const DownloadRow: React.FC<DownloadRowProps> = ({ playlist }) => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem' }}>
      <Image src={playlist.images[0].url} height={150} width={150} alt={playlist.name} />
      <h3>{playlist.name}</h3>
      <h6>{`Num tracks: ${playlist.tracks.total}`}</h6>
    </span>
    <button onClick={() => download(playlist, `${playlist.name}.json`)}>{'Download'}</button>
  </div>
);

export default DownloadRow;
