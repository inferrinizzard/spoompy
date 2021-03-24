import React, { useRef, useLayoutEffect, useState } from 'react';

export interface TreeProps {
	timeline: Timeline;
	artists: ArtistGroup;
}

const Tree: React.FC<TreeProps> = ({ timeline, artists }) => {
	const [width, setWidth] = useState(0);
	const svgRef = useRef<SVGSVGElement>(null);

	useLayoutEffect(() => setWidth(svgRef.current!.clientWidth), []);

	const artistsIndices = Object.keys(artists).reduce(
		(acc, id, i) => ({ ...acc, [id]: i }),
		{} as { [id: string]: number }
	);
	return (
		<svg
			ref={svgRef}
			width="100%"
			height={(Object.keys(timeline).length + 3) * 100}
			style={{ marginTop: '2rem' }}>
			{Object.entries(timeline).map(([month, albums], k) =>
				albums.map(album => (
					<AlbumNode
						text={month + ': ' + album.name}
						key={album.id + '-' + k}
						pos={{
							x:
								(width / 8) * (artistsIndices[album.artist] + 0.5) +
								albums
									.filter(a => a.artist === album.artist)
									.findIndex(({ id }) => id === album.id) *
									20,
							y: 100 * (k + 1),
						}}
						r={16}
						n={49}
					/>
				))
			)}
			{/* <AlbumNode pos={{ x: 100, y: 200 }} r={16} n={49} />
			<CollabLine head={{ x: 100, y: 200 }} tail={{ x: 100, y: 100 }} />
			<AlbumNode pos={{ x: 200, y: 200 }} r={16} n={49} />
			<CollabLine head={{ x: 200, y: 200 }} tail={{ x: 100, y: 100 }} /> */}
		</svg>
	);
};

interface CollabLineProps {
	head: { x: number; y: number };
	tail: { x: number; y: number };
}

const CollabLine: React.FC<CollabLineProps> = ({ head, tail }) => (
	<path
		d={`M ${head.x} ${head.y} h ${4} l ${tail.x - head.x} ${tail.y - head.y} h -${4 * 2} l ${
			head.x - tail.x // fix the h width for consistent thickness
		} ${head.y - tail.y} z`}
	/>
);

interface AlbumNodeProps {
	pos: { x: number; y: number };
	r: number;
	n: number;
	text?: string;
}

const AlbumNode: React.FC<AlbumNodeProps> = ({ pos: { x, y }, r, n, text }) => (
	<circle cx={x} cy={y} r={r}>
		<title>{text}</title>
	</circle>

	// <svg x={x} y={y}>
	// 	<rect x={1} y={1} rx="15" height="100" width="100" fill="white" stroke="black" />
	// 	<g fill="black" stroke="black">
	// 		{[...new Array(n)].map((_, i) => (
	// 			<circle
	// 				key={i}
	// 				cx={16 + 12 * (i % 7) - r / 2 + 1}
	// 				cy={16 + 12 * ((i / 7) >> 0) - r / 2 + 1}
	// 				r={r}
	// 			/>
	// 		))}
	// 	</g>
	// </svg>
);

export default Tree;
