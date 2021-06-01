import React from 'react';

import { Group } from '@visx/group';
import { Pie } from '@visx/shape';

import { GenreData } from '../Inspect';

export interface GenrePieProps {
	data: GenreData;
}

const GenrePie: React.FC<GenrePieProps> = ({ data: { artists, genres } }) => {
	const [height, width] = [400, 400];
	const margin = { top: 60, bottom: 60, left: 80, right: 80 };
	const radius = 200;

	const data = Object.entries(genres).map(([genre, value]) => ({ genre, value }));
	const getValue = (p: ArrayElement<typeof data>) => p.value;
	return (
		<svg width={width} height={height}>
			<Group top={margin.top + radius / 2} left={margin.left + radius / 2}>
				<Pie data={data} pieValue={getValue} outerRadius={radius}>
					{pie =>
						pie.arcs.map((p, i) => {
							const { genre } = p.data;
							const [centroidX, centroidY] = pie.path.centroid(p);
							const hasSpaceForLabel = p.endAngle - p.startAngle >= 0.1;
							const arcPath = pie.path(p)!;
							//  const arcFill = getLetterFrequencyColor(genre);
							return (
								<g key={`p-${genre}-${i}`}>
									<path d={arcPath} fill={`rgb(${(255 / pie.arcs.length) * i}, 255, 255)`} />
									{hasSpaceForLabel && (
										<text
											x={centroidX}
											y={centroidY}
											dy=".33em"
											fill="black"
											fontSize={10}
											textAnchor="middle"
											pointerEvents="none">
											{genre}
										</text>
									)}
								</g>
							);
						})
					}
				</Pie>
			</Group>
		</svg>
	);
};

export default GenrePie;
