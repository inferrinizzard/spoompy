export interface PlaylistTrack {
  name: string;
  artists: string;
  album: string;
  id: string;
  time: string;
  addedBy?: number;
}

export interface PlaylistTrackWithName extends PlaylistTrack {
  playlist: string;
}
