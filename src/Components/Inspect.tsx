import React from 'react';

import { ActivePlaylist } from '../App';
import ContributionGraph from './Charts/ContributionGraph';

export interface InspectProps {
	active: ActivePlaylist;
}

export type Frequency = { [leaf: string]: number };

const Inspect: React.FC<InspectProps> = ({ active }) => {
	const addedFrequency = active!.tracks
		.map(track => track.added_at.split('T')[0])
		.reduce((leaf, date) => ({ ...leaf, [date]: (leaf[date] ?? 0) + 1 }), {} as Frequency);

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				zIndex: 1,
				width: '100%',
				height: '50%',
				backgroundColor: 'white',
			}}>
			<div>{active?.playlist.name}</div>
			<ContributionGraph frequency={addedFrequency} />
			{/* <div>
				{active?.tracks.map(track => (
					<div key={track.track.id}>
						<div style={{ display: 'inline' }}>{track.added_at}</div>
						<div style={{ display: 'inline' }}>{track.track.name}</div>
					</div>
				))}
			</div> */}
		</div>
	);
};

export default Inspect;
