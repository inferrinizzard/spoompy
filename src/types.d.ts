import Spotify from './Spotify';

declare global {
	type SpotifyType = Spotify;

	type ValueOf<T> = T[keyof T];
	type Unpromise<T> = T extends Promise<infer U> ? U : T;

	type Artist = { name: string; id: string };
	type TrackBase = { artists: Artist[]; name: string; id: string };
	type TimelineTrack = { album: string; primary: string; release_date: string };
	type Track = TrackBase & Partial<TimelineTrack>;
	type ArtistGroup = { [id: string]: { name: string; tracks: Track[]; collaborators: Artist[] } };
}
