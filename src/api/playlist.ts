import { readFileSync, readdirSync } from 'fs';

import { type PlaylistTrack, type PlaylistTrackWithName } from '@/types/common';

export const getTracks = (): PlaylistTrackWithName[] => {
  const basePath = 'archive/2023-03-22/redux';

  const files = readdirSync(basePath);
  const playlists = files.map(
    (file) =>
      JSON.parse(
        readFileSync(basePath + '/' + file, 'utf-8'),
      ) as PlaylistTrack[],
  );

  return playlists.reduce(
    (acc, playlist, i) =>
      acc.concat(
        playlist.map((track) =>
          Object.assign(track, { playlist: files[i].replace(/[.]\w+$/, '') }),
        ),
      ),
    [],
  ) as PlaylistTrackWithName[];
};

export const getPlaylist = async (
  playlist: string = 'getPlaylist',
): Promise<SpotifyApi.PlaylistObjectSimplified> => {
  const basePath = 'mock';

  const data = JSON.parse(
    readFileSync(`${basePath}/${playlist}.json`, 'utf-8'),
  ) as SpotifyApi.PlaylistObjectSimplified;

  return await Promise.resolve(data);
};

export const getPlaylists = async (
  userId?: string,
): Promise<SpotifyApi.PlaylistObjectSimplified[]> => {
  const basePath = 'mock';

  const data = JSON.parse(
    readFileSync(`${basePath}/reduxPlaylists.json`, 'utf-8'),
  ) as SpotifyApi.PlaylistObjectSimplified[];

  return await Promise.resolve(data);
};
