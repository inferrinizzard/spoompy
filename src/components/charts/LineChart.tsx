import { type DatumValue, ResponsiveLine } from '@nivo/line';

import store from '@/redux/store';

import Block from '../Block';
import { NivoSliceTooltip } from './NivoTooltip';

export interface LineChartProps {
  datasets: Record<string, { x: DatumValue; y: number }[]>;
}

export const LineChart = ({ datasets }: LineChartProps) => {
  const playlists = store.getState().playlist.playlists;

  const chartData = Object.entries(datasets).map(([id, data]) => ({
    id,
    label: playlists[id].name,
    data,
  }));

  return (
    <Block height={2} width={3} style={{ color: 'black' }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 25, right: 20, bottom: 30, left: 30 }}
        colors={{ scheme: 'nivo' }}
        enableSlices="x"
        xScale={{ type: 'time' }}
        axisBottom={{ format: date => date }}
        sliceTooltip={NivoSliceTooltip}
        legends={[
          {
            data: chartData,
            anchor: 'top',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: -25,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            itemTextColor: 'white',
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
    </Block>
  );
};

export default LineChart;
