/* eslint-disable no-loop-func */

export const loop =
	<
		Func extends (
			query?: any,
			options?: { limit?: number; offset?: number }
		) => Promise<SpotifyApi.PagingObject<any>>
	>(
		fn: Func
	) =>
	async (query?: any) => {
		let out = { items: [] } as Unpromise<ReturnType<Func>>;
		let active = true;
		let i = 0;
		while (active) {
			await fn(query, { offset: 50 * i++, limit: 50 }).then(
				res =>
					res.items.length
						? (out = out
								? {
										...out,
										items: [...out.items, ...res.items],
										limit: out.limit + res.items.length,
								  }
								: (res as any))
						: (active = false),
				() => (active = false)
			);
		}
		return out;
	};

export const getTracks = (album: SpotifyApi.AlbumTracksResponse, artist: string): TrackBase[] =>
	album.items
		.filter(
			({ artists }) => artists.some(a => a.id === artist)
			// && !tracks.some(track => track.id === id)
		)
		.map(({ artists, name, id }) => ({
			artists: artists.map(({ name, id }) => ({ name, id })),
			name,
			id,
		}));

export const getCollaborators = (tracks: Track[], artist: string) =>
	tracks.reduce(
		(acc, { artists }) =>
			artists.length > 1
				? [...acc, ...artists.filter(a => a.id !== artist && !acc.some(ac => ac.id === a.id))]
				: acc,
		[] as Artist[]
	);

export const buildTimeline = (next: ArtistGroup) => (prev: Timeline) =>
	(t =>
		Object.keys(t)
			.sort()
			.reduce((acc, k) => ({ ...acc, [k]: t[k] }), {}))(
		Object.entries(next).reduce((timeline, [artist, { albums }]) => {
			albums.forEach(({ name, id, release_date }) =>
				((month, album) =>
					timeline[month]
						? !timeline[month].some(({ id }) => id === album.id) && timeline[month].push(album)
						: (timeline[month] = [album]))(release_date.slice(0, -3), { name, id, artist })
			);
			return timeline;
		}, prev)
	);

export const timestampSort = <T extends { release_date?: string }>(a: T, b: T) =>
	a.release_date! > b.release_date! ? 1 : -1;

// export const getHistory = ()
