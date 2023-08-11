import {
  type SpotifyAlbum,
  type SpotifyArtist,
  type SpotifyTrack,
} from '@/types/api';

export const trimArtist = (
  artist: SpotifyApi.ArtistObjectSimplified,
): SpotifyArtist => ({
  name: artist.name,
  id: artist.id,
  // uri: artist.uri
});

export const trimAlbum = (
  album: SpotifyApi.AlbumObjectSimplified,
): SpotifyAlbum => ({
  name: album.name,
  // album_type: album.album_type,
  // type: album.type,
  id: album.id,
  // uri: artist.uri
  image: album.images[0].url,
});

export const trimTrack = (
  item: SpotifyApi.PlaylistTrackObject,
): SpotifyTrack => {
  if (!item.track) {
    throw new Error('Track is null!');
  }

  return {
    name: item.track.name,
    artists: item.track.artists.map(trimArtist),
    album: trimAlbum(item.track.album),
    added_at: item.added_at,
    added_by: item.added_by.id,
    id: item.track.id,
    popularity: item.track.popularity,
    type: item.track.type,
  };
};
