export interface PlaylistTrack {
  addedBy?: number;
  album: string;
  artists: string;
  id: string;
  name: string;
  time: string;
}

export interface PlaylistTrackWithName extends PlaylistTrack {
  playlist: string;
}

export interface DateRange {
  end?: string;
  start?: string;
}

export type TimeStep = 'day' | 'month' | 'year';
