export const chunkedArray = (length: number) => new Array(Math.ceil(length / 50)).fill(0);

export const mergeArrays = <T>(lists: T[][]) => lists.reduce((arr, list) => [...arr, ...list], []);

export const stripTrack = (track: SpotifyApi.TrackObjectFull) => ({
	name: track.name,
	artists: track.artists.map(artist => artist.name).join(', '),
	album: track.album.name,
	id: track.id,
});
