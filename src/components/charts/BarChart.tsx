import { ResponsiveBar } from '@nivo/bar';

import store from '@/redux/store';
import { chartTheme } from '@/utils/chartTheme';

import Block from '../Block';
import { NivoBarTooltip } from './NivoTooltip';

export interface BarChartProps {
  data: Record<string, number>;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const playlists = store.getState().playlist.playlists;

  const chartData = Object.entries(data).map(([id, tracks]) => ({ id, tracks }));

  return (
    <Block height={2} width={3} style={{ color: 'black' }}>
      <ResponsiveBar
        theme={chartTheme}
        data={chartData}
        axisBottom={{ format: id => playlists[id].name }}
        keys={['tracks']}
        margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        valueScale={{ type: 'linear' }}
        tooltip={NivoBarTooltip}
      />
    </Block>
  );
};

export default BarChart;
