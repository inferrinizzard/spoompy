import React from 'react';

import { scaleLinear, scaleTime } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { max, extent } from 'd3-array';

import { DateFreqList } from '../Inspect';

export interface ContributionGraphProps {
	frequency: DateFreqList;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ frequency }) => {
	const data = frequency;
	type Datum = ArrayElement<typeof data>;

	const [height, width] = [400, 800];
	const margin = { top: 50, bottom: 50, left: 50, right: 50 };
	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;

	const x = (d: Datum) => d.raw;
	const y = (d: Datum) => d.value;

	const xScale = scaleTime({
		range: [0, xMax],
		domain: extent(data, x) as [number, number],
		nice: true,
	});
	const yScale = scaleLinear({
		range: [yMax, 0],
		domain: [0, Math.max(5, max(data, y) as number) as number],
		nice: true,
	});

	return (
		<svg width={width} height={height}>
			<Group top={margin.top} left={margin.left}>
				{data.map(({ raw, value }, i) =>
					value ? (
						<Bar
							key={i}
							height={yMax - yScale(value)}
							width={xMax / data.length}
							x={xScale(raw)}
							y={yScale(value)}
							fill={'red'}
						/>
					) : null
				)}
				<AxisLeft
					numTicks={(([a, b]) => Math.min(10, b - a))(yScale.domain())}
					tickFormat={yScale.tickFormat(4, 's')}
					scale={yScale}
					top={0}
					left={0}
					label={'Tracks Added'}
					stroke={'#1b1a1e'}
				/>
				<AxisBottom scale={xScale} top={yMax} label={'Time'} stroke={'#1b1a1e'} />
			</Group>
		</svg>
	);
};

export default ContributionGraph;
