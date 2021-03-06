import Spotify from './Spotify';

declare global {
	type SpotifyType = Spotify;

	type ValueOf<T> = T[keyof T];
	type Unpromise<T> = T extends Promise<infer U> ? U : T;

	type Artist = { name: string; id: string };
	type Track = {
		artists: Artist[];
		name: string;
		id: string;
		album?: string;
		release_date?: string;
	};
	type ArtistGroup = { [id: string]: { name: string; tracks: Track[]; collaborators: Artist[] } };
}
