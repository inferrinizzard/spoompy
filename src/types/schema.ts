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
  tracks: Record<
    string,
    SpliceObject<SpliceObject<SpotifyTrack, 'artists', string[]>, 'album', string[]>
  >;
  playlists: Record<string, SpliceObject<SpotifyPlaylist, 'tracks', string[]>>;
}
