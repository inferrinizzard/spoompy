import React from 'react';

import { Group } from '@visx/group';
import { Pie } from '@visx/shape';

import { GenreData } from '../Inspect';

export interface GenrePieProps {
	data: GenreData;
}

const GenrePie: React.FC<GenrePieProps> = ({ data: { artists, genres } }) => {
	const r = 200;

	const data = Object.entries(genres)
		.map(([genre, value]) => ({ genre, value }))
		.sort((a, b) => b.value - a.value || (b.genre > a.genre ? -1 : 1));
	const freq = (total =>
		data.reduce(
			({ count, arr }, { value }) => ({ count: count - value, arr: [...arr, count / total] }),
			{ count: total, arr: [] as number[] }
		).arr)(data.reduce((sum, { value }) => sum + value, 0));
	const getValue = (p: ArrayElement<typeof data>) => p.value;

	return (
		<svg width={r * 2} height={r * 2}>
			<Group top={r} left={r}>
				<Pie data={data} pieValue={getValue} pieSortValues={(a, b) => b - a} outerRadius={r}>
					{pie =>
						pie.arcs.map((p, i) => {
							const { genre } = p.data;
							const [centroidX, centroidY] = pie.path.centroid(p);
							const hasSpaceForLabel = p.endAngle - p.startAngle >= 0.3;
							const arcPath = pie.path(p)!;

							return (
								<g key={`p-${genre}-${i}`}>
									<path d={arcPath} fill={`hsl(${freq[i] * 100}, 100%, 50%)`} />
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
