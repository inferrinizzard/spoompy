import Spotify from './Spotify';

declare global {
	type SpotifyType = Spotify;

	type ValueOf<T> = T[keyof T];
	type ArrayElement<ArrayType extends readonly unknown[]> =
		ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
	type Unpromise<T> = T extends Promise<infer U> ? U : T;

	type ID = { name: string; id: string };
	type Artist = ID;

	type TrackBase = ID & { artists: Artist[] };
	type TimelineTrack = { album: string; primary: string; release_date: string };
	type Track = TrackBase & Partial<TimelineTrack>;

	type Album = ID & { tracks: Track[]; img?: string; release_date: string };
	type ArtistGroup = { [id: string]: { name: string; albums: Album[]; collaborators: Artist[] } };

	type Timeline = { [month: string]: (ID & { artist: string })[] };
}
