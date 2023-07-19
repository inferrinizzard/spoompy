import { useOrdinalColorScale } from '@nivo/colors';
import { type DatumValue, ResponsiveLine } from '@nivo/line';

import store from '@/redux/store';
import { chartTheme } from '@/utils/chartTheme';

import Block from '../Block';
import { NivoSliceTooltip } from './NivoTooltip';
import { formatDate } from '@/utils/dateFormat';

export interface LineChartProps {
  datasets: Record<string, { x: DatumValue; y: number }[]>;
}

export const LineChart = ({ datasets }: LineChartProps) => {
  const playlists = store.getState().playlist.playlists;
  const timeStep = store.getState().analysis.timeStep;

  const chartData = Object.entries(datasets).map(([id, data]) => ({ id, data }));

  const getColor = useOrdinalColorScale({ scheme: 'nivo' }, 'id');

  return (
    <Block height={2} width={3} style={{ color: 'black' }}>
      <ResponsiveLine
        theme={chartTheme}
        data={chartData}
        margin={{ top: 25, right: 20, bottom: 30, left: 30 }}
        colors={{ scheme: 'nivo' }}
        enableSlices="x"
        xScale={{ type: 'time', precision: timeStep }}
        axisBottom={{
          format: date => formatDate(date, timeStep),
          tickValues:
            timeStep === 'year'
              ? 'every year'
              : timeStep === 'month'
              ? 'every 3 months'
              : 'every 10 days',
        }}
        sliceTooltip={NivoSliceTooltip}
        legends={[
          {
            data: chartData.map(line => ({
              ...line,
              label: playlists[line.id].name,
              color: getColor(line),
            })),
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
