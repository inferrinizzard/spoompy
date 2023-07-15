import {
  type SpotifyAlbum,
  type SpotifyArtist,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from './api';
import { type IdsOf } from './entities';
import { type SpliceObject } from './util';

export interface NormalizedPlaylists<Playlists extends SpotifyPlaylist[]> {
  result: IdsOf<Playlists>;
  entities: PlaylistEntities;
}

export interface PlaylistEntities {
  albums: Record<string, SpotifyAlbum>;
  artists: Record<string, SpotifyArtist>;
  tracks: PlaylistTrackEntityMap;
  playlists: Record<string, SpliceObject<SpotifyPlaylist, 'tracks', string[]>>;
}

export type PlaylistTrackEntityMap = Record<
  string,
  Omit<PlaylistTrackEntityWithNormalizedArtistsAndAlbums, 'added_at' | 'added_by'> & {
    playlists: Record<string, Pick<SpotifyTrack, 'added_at' | 'added_by'>>;
  }
>;

export type PlaylistTrackEntityWithNormalizedArtistsAndAlbums = SpliceObject<
  SpliceObject<SpotifyTrack, 'artists', string[]>,
  'album',
  string
>;

export type PlaylistEntityMap = Record<string, SpliceObject<SpotifyPlaylist, 'tracks', string[]>>;
