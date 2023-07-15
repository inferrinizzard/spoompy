import { readFileSync } from 'fs';

import { trimTrack } from './utils/track';

export const getPlaylistTracks = (id: string) => {
  // spotify.getPlaylistTracks(id). etc

  const playlistMap = JSON.parse(readFileSync('mock/tracks.json', 'utf-8'));

  const playlistTracks = playlistMap[id] as SpotifyApi.PlaylistTrackObject[];

  return playlistTracks.map(trimTrack);
};
