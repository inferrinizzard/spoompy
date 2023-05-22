import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';

import Block from '../Block';

export interface LineChartProps<Datum> {
  datasets: Record<string, Datum[]>;
  x: keyof Datum & string;
  y: keyof Datum & string;
}

export const LineChart = <Datum,>({ datasets, x, y }: LineChartProps<Datum>) => {
  const victoryDatasets = Object.entries(datasets);

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
            x={x}
            y={y}
          />
        ))}
      </VictoryChart>
    </Block>
  );
};

export default LineChart;
