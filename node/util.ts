import { lstat, readdir } from "node:fs/promises";

export const chunkedArray = (length: number) =>
	new Array(Math.ceil(length / 50)).fill(0);

export const mergeArrays = <T>(lists: T[][]) =>
	lists.reduce((arr, list) => [...arr, ...list], []);

export const stripTrack = (track: SpotifyApi.TrackObjectFull) => ({
	name: track.name,
	artists: track.artists.map((artist) => artist.name).join(", "),
	album: track.album.name,
	id: track.id,
});

export const getDirs = async (path: string) =>
	readdir(`${path}`).then(async (files) => {
		const dirs: string[] = [];

		await Promise.all(
			files.map(async (name) => {
				if ((await lstat(`${path}/${name}`)).isDirectory()) {
					dirs.push(name);
				}
			}),
		);

		return dirs;
	});
