import { readFileSync, readdirSync } from 'fs';

import { type PlaylistTrack } from '@/types/common';

export const getPlaylists = () => {
  const basePath = 'archive/2023-03-22/redux';

  const files = readdirSync(basePath);
  const playlists = files.map(
    file => JSON.parse(readFileSync(basePath + '/' + file, 'utf-8')) as PlaylistTrack[]
  );

  return files.reduce(
    (acc, file, i) => ({ ...acc, [file.split('.')[0]]: playlists[i] }),
    {} as Record<string, PlaylistTrack[]>
  );
};
