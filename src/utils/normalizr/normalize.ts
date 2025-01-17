/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { normalize, schema } from "normalizr";

import { type SpotifyPlaylist, type SpotifyTrack } from "@/types/api";
import {
	type NormalizedPlaylists,
	type NormalizedTracks,
} from "@/types/schema";

const artistSchema = new schema.Entity("artists");

const albumSchema = new schema.Entity("albums");

type SpotifyTrackWithPlaylist = SpotifyTrack & {
	playlists?: Record<string, string>;
};

const trackSchema = new schema.Entity(
	"tracks",
	{
		album: albumSchema,
		artists: [artistSchema],
	},
	{
		mergeStrategy: (
			a: SpotifyTrackWithPlaylist,
			b: SpotifyTrackWithPlaylist,
		) => ({
			...a,
			playlists: { ...a.playlists, ...b.playlists },
		}),
		processStrategy: (
			trackWithPlaylists: SpotifyTrackWithPlaylist,
			parentPlaylist: SpotifyPlaylist,
		) => {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { added_at, added_by, ...rest } = trackWithPlaylists;

			return {
				...rest,
				playlists: {
					...trackWithPlaylists.playlists,
					[parentPlaylist.id ?? "playlist"]: { added_at, added_by },
				},
			};
		},
	},
);

const tracksArray = new schema.Array(trackSchema);

const playlistSchema = new schema.Entity("playlists", {
	tracks: [trackSchema],
});

const playlistArray = new schema.Array(playlistSchema);

export const normalizePlaylist = (playlist: SpotifyPlaylist) =>
	normalize(playlist, playlistSchema);

export const normalizePlaylists = (playlists: SpotifyPlaylist[]) =>
	normalize(playlists, playlistArray) as NormalizedPlaylists;

export const normalizeTracks = (tracks: SpotifyTrack[]) =>
	normalize(tracks, tracksArray) as NormalizedTracks;
