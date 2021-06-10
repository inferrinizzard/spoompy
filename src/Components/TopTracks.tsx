import React, { useContext } from 'react';

import { SpotifyContext } from '../App';
import DisplayTop from './DisplayTop';

const TopTracks: React.FC<{}> = () => {
	const spotify = useContext(SpotifyContext);

	return (
		<DisplayTop<SpotifyApi.TrackObjectFull>
			fetchFunction={spotify.getMyTopTracks}
			topCarousel={data => (
				<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
					{data.slice(0, 10).map(item => (
						<div key={item.id} style={{ display: 'inline-block' }}>
							<img src={item.album.images[0].url} alt={item.name} height={250} width={250} />
						</div>
					))}
				</div>
			)}
			tableHeader={
				<>
					<th>Rank</th>
					<th colSpan={2}>Name</th>
					<th>Artists</th>
					<th>Album</th>
					<th>Popularity</th>
				</>
			}
			tableRow={(track, i) => (
				<tr key={track.id}>
					<td>
						<p style={{ fontSize: '1rem' }}>{`${i + 1}.`}</p>
					</td>
					<td>
						<img src={track.album.images[0].url} alt={track.name} height={50} width={50} />
					</td>
					<td>{track.name}</td>
					<td>{track.artists.map(({ name }) => name).join(', ')}</td>
					<td>{track.album.name}</td>
					<td>{track.popularity}</td>
					{/* <td>{track.followers.total}</td> */}
				</tr>
			)}
		/>
	);
};

export default TopTracks;
