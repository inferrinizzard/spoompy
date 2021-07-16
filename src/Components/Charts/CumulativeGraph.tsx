import React from 'react';

import { scaleTime, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { AreaClosed } from '@visx/shape';
import { curveBasis } from '@visx/curve';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { max, extent } from 'd3-array';

import { DateFreqList } from '../Elements/Inspect';
export interface CumulativeGraphProps {
	frequency: DateFreqList;
}

const CumulativeGraph: React.FC<CumulativeGraphProps> = ({ frequency }) => {
	type Datum = ArrayElement<typeof frequency>;
	const data = frequency.reduce(
		(acc, { raw, date, value }) =>
			[
				...acc,
				{ raw, date, value: acc.length ? acc[acc.length - 1].value + value : value },
			] as Datum[],
		[] as Datum[]
	);

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
	const yScale = scaleLinear({ range: [yMax, 0], domain: [0, max(data, y) as number], nice: true });

	return (
		<svg width={width} height={height}>
			<Group top={margin.top} left={margin.left}>
				<AreaClosed
					curve={curveBasis}
					data={data}
					yScale={yScale}
					x={d => xScale(x(d))}
					y={d => yScale(y(d))}
					stroke="#fff"
					fill="aliceblue"
				/>
				<AxisLeft
					numTicks={(([a, b]) => Math.min(10, b - a))(yScale.domain())}
					tickFormat={yScale.tickFormat(4, 's')}
					scale={yScale}
					top={0}
					left={0}
					label={'Tracks Added'}
					labelOffset={24}
					tickLabelProps={() => ({ fill: '#fff', fontSize: '0.75rem', textAnchor: 'end' })}
					stroke={'#fff'}
					tickStroke={'#fff'}
					labelProps={{ fill: '#fff' }}
				/>
				<AxisBottom
					scale={xScale}
					top={yMax}
					label={'Time'}
					labelOffset={24}
					tickLabelProps={() => ({ fill: '#fff', fontSize: '0.75rem', textAnchor: 'middle' })}
					stroke={'#fff'}
					tickStroke={'#fff'}
					labelProps={{ fill: '#fff' }}
				/>
			</Group>
		</svg>
	);
};

export default CumulativeGraph;
