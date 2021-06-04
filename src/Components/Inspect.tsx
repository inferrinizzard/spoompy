import React, { useState, useEffect, useContext } from 'react';

import { SpotifyContext, ActivePlaylist } from '../App';
import ContributionGraph from './Charts/ContributionGraph';
import CumulativeGraph from './Charts/CumulativeGraph';
import GenrePie from './Charts/GenrePie';

export interface InspectProps {
	active: ActivePlaylist;
}

export type Frequency = { [leaf: string]: number };
export type GenreData = {
	artists: { [artist: string]: string[] }; // artist to genre mapping
	genres: Frequency; // genre frequency
};

const frequency = (data: string[]) =>
	data.reduce((acc, d) => ({ ...acc, [d]: (acc[d] ?? 0) + 1 }), {} as Frequency);

const Inspect: React.FC<InspectProps> = ({ active }) => {
	const spotify = useContext(SpotifyContext);

	const addedFrequency = frequency(active!.tracks.map(track => track.added_at.split('T')[0]));

	const artistList = active!.tracks.reduce(
		(artists, { track }) => [
			...artists,
			...(track as SpotifyApi.TrackObjectFull).artists.map(({ id }) => id),
			// .filter(a => !artists.includes(a)),
		],
		[] as string[]
	);
	const fetchArtists = Promise.all(
		new Array(Math.ceil(artistList.length / 50))
			.fill(0)
			.map((_, i) => spotify.getArtists(artistList.slice(i * 50, (i + 1) * 50)))
	).then(res =>
		res.reduce((arr, { artists }) => [...arr, ...artists], [] as SpotifyApi.ArtistObjectFull[])
	);

	const artistFreq = frequency(artistList);
	const [artistData, setArtistData] = useState([] as SpotifyApi.ArtistObjectFull[]);
	const [genreData, setGenreData] = useState({} as GenreData);

	useEffect(() => {
		fetchArtists.then(artists => {
			setArtistData(artists);
			const _artists = artists.reduce(
				(lookup, a) => (a.genres.length ? { ...lookup, [a.id]: a.genres } : lookup),
				{} as { [artist: string]: string[] }
			);
			const _genres = frequency(([] as string[]).concat(...Object.values(_artists)));
			setGenreData({ artists: _artists, genres: _genres });
		});
	}, [active]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				zIndex: 1,
				width: '100%',
				height: '100%',
				backgroundColor: 'white',
			}}>
			<div>{active?.playlist.name}</div>
			<ContributionGraph frequency={addedFrequency} />
			{artistData.length && Object.keys(genreData).length && <GenrePie data={genreData} />}
			<CumulativeGraph frequency={addedFrequency} />
		</div>
	);
};

export default React.memo(
	Inspect,
	(prev, next) => prev.active?.playlist.id === next.active?.playlist.id
);
