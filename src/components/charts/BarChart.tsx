import { ResponsiveBar } from '@nivo/bar';

import store from '@/redux/store';

import Block from '../Block';

export interface BarChartProps {
  data: Record<string, number>;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const playlists = store.getState().playlist.playlists;

  const chartData = Object.entries(data).map(([id, tracks]) => ({ id, tracks }));

  return (
    <Block height={2} width={3} style={{ color: 'black' }}>
      <ResponsiveBar
        data={chartData}
        axisBottom={{ format: id => playlists[id].name }}
        keys={['tracks']}
        margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        valueScale={{ type: 'linear' }}
        // tooltip={} // TODO: custom tooltip label
      />
    </Block>
  );
};

export default BarChart;
