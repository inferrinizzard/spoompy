import Spotify from './Spotify';

declare global {
	type SpotifyType = Spotify;
	type ValueOf<T> = T[keyof T];
}
