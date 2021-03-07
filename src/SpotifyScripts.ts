/* eslint-disable no-loop-func */

export const loop = <
	Func extends (
		query: string,
		options?: { limit?: number; offset?: number }
	) => Promise<SpotifyApi.PagingObject<any>>
>(
	fn: Func
) => async (query: string) => {
	let out = { items: [] } as Unpromise<ReturnType<Func>>;
	let active = true;
	let i = 0;
	while (active)
		await fn(query, { offset: 50 * i++, limit: 50 }).then(
			res =>
				res.items.length
					? (out = out
							? { ...out, items: [...out.items, ...res.items], limit: out.limit + res.items.length }
							: (res as any))
					: (active = false),
			() => (active = false)
		);
	return out;
};

export const getTracks = (albums: SpotifyApi.AlbumTracksResponse[], artist: string) =>
	albums.reduce(
		(tracks, { items }) => [
			...tracks,
			...items
				.filter(
					({ artists, id }) =>
						artists.some(a => a.id === artist) && !tracks.some(track => track.id === id)
				)
				.map(({ artists, name, id }) => ({
					artists: artists.map(({ name, id }) => ({ name, id })),
					name,
					id,
				})),
		],
		[] as Track[]
	);

export const getCollaborators = (tracks: Track[], artist: string) =>
	tracks.reduce(
		(acc, track) =>
			track.artists.length > 1
				? [...acc, ...track.artists.filter(a => a.id !== artist && !acc.some(ac => ac.id === a.id))]
				: acc,
		[] as Artist[]
	);

// export const getHistory = ()
