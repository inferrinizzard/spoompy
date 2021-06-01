import React from 'react';

import { scaleTime, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { LinePath, AreaClosed } from '@visx/shape';
import { curveMonotoneX, curveBasis } from '@visx/curve';
import { AxisLeft, AxisRight, AxisBottom } from '@visx/axis';
import { max, extent } from 'd3-array';

import { Frequency } from '../Inspect';

const generateDates = (start: string | Date, end: string | Date) => {
	const startDate = +new Date(start);
	const endDate = +new Date(end);
	const msDay = 86400000;
	return new Array(Math.ceil((endDate - startDate) / msDay))
		.fill(0)
		.map((_, i) => startDate + i * msDay);
};

export interface ContributionGraphProps {
	frequency: Frequency;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ frequency }) => {
	const keys = (k => ({
		start: k[0],
		end: k[k.length - 1],
		lookup: k.reduce(
			(acc, cur) => ({ ...acc, [+new Date(cur)]: cur }),
			{} as { [time: number]: string }
		),
	}))(Object.keys(frequency).sort());
	const data = generateDates(keys.start, keys.end).map(d => [
		d,
		frequency[keys.lookup[d]] ?? 0,
	]) as [number, number][];
	type Datum = ArrayElement<typeof data>;
	const cumData = data.reduce(
		(acc, [date, val]) =>
			[...acc, [date, acc.length ? acc[acc.length - 1][1] + val : val]] as Datum[],
		[] as Datum[]
	);

	const [height, width] = [400, 1800];
	const margin = { top: 60, bottom: 60, left: 80, right: 80 };
	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;

	const x = (d: Datum) => d[0];
	const y = (d: Datum) => d[1];

	const xScale = scaleTime({ range: [0, xMax], domain: extent(data, x) as Datum });
	const yScale = scaleLinear({ range: [yMax, 0], domain: [0, max(data, y) as number] });
	const yScaleCum = scaleLinear({ range: [yMax, 0], domain: [0, max(cumData, y) as number] });

	return (
		<svg width={width} height={height}>
			<Group top={margin.top} left={margin.left}>
				{/* <AreaClosed // split into CumulativeGraph
					curve={curveBasis}
					data={cumData}
					yScale={yScaleCum}
					x={d => xScale(x(d))}
					y={d => yScaleCum(y(d))}
					stroke="#333"
					fill={'aliceblue'}
				/> */}
				<LinePath // maybe make you a bargraph
					curve={curveMonotoneX}
					data={data}
					x={d => xScale(x(d))}
					y={d => yScale(y(d))}
					stroke="#333"
					strokeWidth={1}
					strokeOpacity={1}
					shapeRendering="geometricPrecision"
				/>
				{/* <AxisRight
					scale={yScaleCum}
					top={0}
					left={xMax}
					label={'Cumulative Tracks'}
					stroke={'#1b1a1e'}
				/> */}
				<AxisLeft scale={yScale} top={0} left={0} label={'Tracks Added'} stroke={'#1b1a1e'} />
				<AxisBottom scale={xScale} top={yMax} label={'Time'} stroke={'#1b1a1e'} />
			</Group>
		</svg>
	);
};

export default ContributionGraph;
