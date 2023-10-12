import { type PlaylistEntities } from '@/types/schema';

export const mergeEntities = (
  baseEntities: PlaylistEntities,
  newEntities: PlaylistEntities,
): PlaylistEntities => {
  const artists = Object.assign(baseEntities.artists, newEntities.artists);
  const albums = Object.assign(baseEntities.albums, newEntities.albums);
  const playlists = Object.assign(
    baseEntities.playlists,
    newEntities.playlists,
  );

  let baseTracks = baseEntities.tracks;
  let newTracks = newEntities.tracks;

  // add refs to new playlists for existing tracks
  Object.values(newTracks).forEach((track) => {
    if (baseTracks[track.id]) {
      const baseTrackPlaylistRefs = baseTracks[track.id].playlists;
      baseTracks[track.id].playlists = Object.assign(
        baseTrackPlaylistRefs,
        track.playlists,
      );
    } else {
      baseTracks[track.id] = track;
    }
  });

  return { artists, albums, playlists, tracks: baseTracks };
};
