import { type Image } from '@spotify/web-api-ts-sdk';

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  id: string;
  images: Image[];
  name: string;
  owner: string;
  public: boolean;
  // snapshotId: string;
  tracks: SpotifyTrack[];
  // type: string;
}

export interface SpotifyTrack {
  added_at: string;
  added_by: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  id: string;
  name: string;
  popularity: number;
  type: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  image: string;
  name: string;
}

export interface AuthCredentials {
  code: string;
  state?: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export interface UserDetails {
  id: string;
  image: string;
  name: string;
}
