import { readFileSync } from 'fs';

import { type SpotifyTrack } from '@/types/api';

import { trimTrack } from './utils/trim';

export const getPlaylistTracks = (id: string): SpotifyTrack[] => {
  // spotify.getPlaylistTracks(id). etc

  const playlistMap = JSON.parse(readFileSync('mock/tracks.json', 'utf-8'));

  const playlistTracks = playlistMap[id] as SpotifyApi.PlaylistTrackObject[];

  return playlistTracks.map(trimTrack);
};
