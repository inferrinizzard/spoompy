import { type DatumValue, ResponsiveLine } from '@nivo/line';

import Block from '../Block';

export interface LineChartProps {
  datasets: Record<string, { x: DatumValue; y: number }[]>;
}

export const LineChart = ({ datasets }: LineChartProps) => {
  const chartData = Object.entries(datasets).map(([id, data]) => ({ id, data }));

  return (
    <Block height={2} width={3} style={{ color: 'black' }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 80, bottom: 20, left: 30 }}
        colors={{ scheme: 'nivo' }}
        enableSlices="x"
        // sliceTooltip={} // TODO: add date to slice tooltip
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
      {/* <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        height={450}
        width={750}
        scale={{ x: 'time' }}>
        <VictoryAxis label="Date" />
        {victoryDatasets.map(([label, dataset]) => (
          <VictoryLine
            key={label}
            style={{
              data: { stroke: '#c43a31', strokeWidth: '4px' },
              parent: { border: '1px solid #ccc' },
            }}
            data={dataset}
            x={x}
            y={y}
          />
        ))}
      </VictoryChart> */}
    </Block>
  );
};

export default LineChart;
