import { type PlaylistState } from '@/redux/slices/playlistSlice';
import { type SpotifyPlaylist } from '@/types/api';

const createDownloadAnchor = () => {
  const anchorId = 'downloadAnchor';

  let downloadAnchor = document.getElementById(anchorId);

  if (!downloadAnchor) {
    downloadAnchor = document.createElement('a');
    downloadAnchor.id = 'downloadAnchor';
    downloadAnchor.setAttribute('style', 'display: none');
    document.body.appendChild(downloadAnchor);
  }

  return downloadAnchor as HTMLAnchorElement;
};

export const download = (data: unknown, filename: string) => {
  const downloadAnchor = createDownloadAnchor();

  const dataJson = JSON.stringify(data);
  const blob = new Blob([dataJson], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);

  downloadAnchor.href = url;
  downloadAnchor.download = filename;
  downloadAnchor.click();

  window.URL.revokeObjectURL(url);
};

export const simplifyPlaylist = (
  playlist: PlaylistState['playlists'][number],
) => {
  // TODO: simplification fn, with options ?
  return playlist;
};
