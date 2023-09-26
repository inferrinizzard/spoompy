import {
  type PlaylistedTrack,
  type SimplifiedAlbum,
  type SimplifiedArtist,
  type Track,
} from '@spotify/web-api-ts-sdk';

import {
  type SpotifyAlbum,
  type SpotifyArtist,
  type SpotifyTrack,
} from '@/types/api';

export const trimArtist = (artist: SimplifiedArtist): SpotifyArtist => ({
  name: artist.name,
  id: artist.id,
  // uri: artist.uri
});

export const trimAlbum = (album: SimplifiedAlbum): SpotifyAlbum => ({
  name: album.name,
  // album_type: album.album_type,
  // type: album.type,
  id: album.id,
  // uri: artist.uri
  image: album.images[0].url,
});

export const trimTrack = (item: PlaylistedTrack): SpotifyTrack => {
  if (!item.track) {
    throw new Error('Track is null!');
  }

  const track = item.track as Track;

  return {
    name: track.name,
    artists: track.artists.map(trimArtist),
    album: trimAlbum(track.album),
    added_at: item.added_at,
    added_by: item.added_by.id,
    id: track.id,
    popularity: track.popularity,
    type: track.type,
  };
};
