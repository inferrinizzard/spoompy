import { readFileSync, readdirSync } from 'fs';

import { type PlaylistTrackWithName, type PlaylistTrack } from '@/types/common';

export const getTracks = () => {
  const basePath = 'archive/2023-03-22/redux';

  const files = readdirSync(basePath);
  const playlists = files.map(
    file => JSON.parse(readFileSync(basePath + '/' + file, 'utf-8')) as PlaylistTrack[]
  );

  return playlists.reduce(
    (acc, playlist, i) =>
      acc.concat(
        playlist.map(track => Object.assign(track, { playlist: files[i].replace(/[.]\w+$/, '') }))
      ),
    []
  ) as PlaylistTrackWithName[];
};

export const getPlaylist = (
  playlist: string = 'getPlaylist'
): Promise<SpotifyApi.PlaylistObjectFull> => {
  const basePath = 'mock';

  const data = JSON.parse(
    readFileSync(`${basePath}/${playlist}.json`, 'utf-8')
  ) as SpotifyApi.PlaylistObjectFull;

  const image = ''; // url to image

  return Promise.resolve(data);
};
