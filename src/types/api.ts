import { type Image } from "@spotify/web-api-ts-sdk";

export interface SpotifyPlaylist extends PlaylistRef {
	collaborative: boolean;
	description: string;
	id: string;
	images: Image[];
	name: string;
	owner: string;
	public: boolean;
	snapshotId: string;
	total: number;
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

export interface PlaylistRef {
	id: string;
	snapshotId: string;
}

export interface PlaylistTracksRef {
	playlistId: string;
	tracks: SpotifyTrack[];
}
