'use client';

import { download } from '../util/download';

export interface DownloadRowProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

export const DownloadRow: React.FC<DownloadRowProps> = ({ playlist }) => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <span>
      <h3 style={{ display: 'inline-block' }}>{playlist.name}</h3>
      <h6 style={{ display: 'inline-block' }}>{`Num tracks: ${playlist.tracks.total}`}</h6>
    </span>
    <button onClick={() => download(playlist, `${playlist.name}.json`)}>{'Download'}</button>
  </div>
);

export default DownloadRow;
