import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';
import { type ValueOf } from 'next/dist/shared/lib/constants';

import { type PointLabelMap } from '@/types/common';

import Block from '../Block';

export interface LineChartProps<Datum extends Record<string, unknown>> {
  datasets: Record<string, Datum[]>;
  labelMap: PointLabelMap<Datum>;
}

export const LineChart = <Datum extends Record<string, unknown>>({
  datasets,
  labelMap,
}: LineChartProps<Datum>) => {
  const victoryDatasets = Object.entries(datasets).map(
    ([label, dataset]) =>
      [label, dataset.map(datum => ({ x: datum[labelMap.x], y: datum[labelMap.y] }))] as [
        string,
        { x: ValueOf<Datum>; y: ValueOf<Datum> }[]
      ]
  );

  return (
    <Block height={3} width={5}>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10} height={450} width={750}>
        {victoryDatasets.map(([label, dataset]) => (
          <VictoryLine
            key={label}
            style={{
              data: { stroke: '#c43a31', strokeWidth: '8px' },
              parent: { border: '1px solid #ccc' },
            }}
            data={dataset}
          />
        ))}
      </VictoryChart>
    </Block>
  );
};

export default LineChart;
