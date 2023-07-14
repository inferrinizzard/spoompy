export interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  added_at: string;
  added_by: string;
  id: string;
  popularity: number;
  type: string;
}

export interface SpotifyArtist {
  name: string;
  id: string;
}

export interface SpotifyAlbum {
  name: string;
  id: string;
  image: string;
}

export interface SpotifyPlaylist extends SpotifyApi.PlaylistBaseObject {
  tracks: SpotifyTrack[];
}
