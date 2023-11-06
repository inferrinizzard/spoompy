'use client';

import { type PlaylistState } from '@/redux/slices/playlistSlice';
import { Button, Image } from '@/styles/primitives';

import { download, simplifyPlaylist } from '../util/download';

export interface DownloadRowProps {
  playlist: PlaylistState['playlists'][number];
}

export const DownloadRow: React.FC<DownloadRowProps> = ({ playlist }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2rem',
      }}>
      <Image
        alt={playlist.name}
        height={150}
        src={playlist.images[0].url}
        width={150}
      />
      <h3>{playlist.name}</h3>
      <h6>{`Num tracks: ${playlist.tracks.length}`}</h6>
    </span>
    <span>
      <Button onClick={() => download(playlist, `${playlist.name}.json`)}>
        {'Download'}
      </Button>
      <Button
        onClick={() =>
          download(simplifyPlaylist(playlist), `${playlist.name}.json`)
        }>
        {'Download Simplified'}
      </Button>
    </span>
  </div>
);

export default DownloadRow;
