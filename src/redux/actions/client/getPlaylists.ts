import { getClientSpotify } from "@/spotify";
import {
	normalizePlaylists,
	normalizeTracks,
} from "@/utils/normalizr/normalize";
import { type PlaylistRef } from "@/types/api";

import store from "../../store";
import {
	updateEntities,
	updateWithPlaylistTracks,
} from "../../slices/playlistSlice";

export const getPlaylistTracks = async (
	playlistTrackRequests: Array<{ id: string; total: number }>,
): Promise<void> => {
	let playlistTrackRequestsParams = playlistTrackRequests.reduce(
		(acc, { id, total }) => {
			for (let i = 100; i < total; i += 50) {
				acc.push({ id, offset: i });
			}

			return acc;
		},
		[] as Array<{ id: string; offset: number }>,
	);

	let hasFetchedAllPlaylistTracks = false;
	let playlistTracksPromise = getClientSpotify().getPlaylistTracks(
		playlistTrackRequestsParams,
	);

	while (!hasFetchedAllPlaylistTracks) {
		const playlistTrackBatch = await playlistTracksPromise;

		if (playlistTrackBatch.next) {
			playlistTracksPromise = playlistTrackBatch.next();
		} else {
			hasFetchedAllPlaylistTracks = true;
		}

		const fetchedPlaylistTracks = playlistTrackBatch.data;
		fetchedPlaylistTracks.forEach(({ playlistId, tracks }) => {
			const normalizedTracks = normalizeTracks(tracks);

			store.dispatch(
				updateWithPlaylistTracks({
					playlistId,
					tracks: normalizedTracks.entities,
				}),
			);
		});
	}
};

export const getAllPlaylists = async (
	playlists: PlaylistRef[],
): Promise<void> => {
	let hasFetchedAllPlaylists = false;
	let playlistPromise = getClientSpotify().getAllPlaylists(playlists);

	let playlistTrackRequests = [];

	while (!hasFetchedAllPlaylists) {
		const playlistBatch = await playlistPromise;

		if (playlistBatch.next) {
			playlistPromise = playlistBatch.next();
		} else {
			hasFetchedAllPlaylists = true;
		}

		const fetchedPlaylists = playlistBatch.data;

		const normalizedPlaylists = normalizePlaylists(fetchedPlaylists);
		store.dispatch(updateEntities(normalizedPlaylists.entities));

		for (const playlist of fetchedPlaylists) {
			if (playlist.total > 100) {
				playlistTrackRequests.push({ id: playlist.id, total: playlist.total });
			}
		}
	}

	await getPlaylistTracks(playlistTrackRequests);
};
