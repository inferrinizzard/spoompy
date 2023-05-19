import { type PlaylistTrackWithName, type PlaylistTrack } from '@/types/common';

export const tracksWithPlaylist = (playlists: Record<string, PlaylistTrack[]>) =>
  Object.entries(playlists).reduce(
    (acc, [playlist, tracks]) =>
      acc.concat(tracks.map(track => Object.assign(track, { playlist }))),
    [] as PlaylistTrackWithName[]
  );
