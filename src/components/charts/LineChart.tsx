import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';

import Block from '../Block';

export interface LineChartProps {
  data: Record<string, number>;
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const victoryData = Object.entries(data).map(([label, value]) => ({ x: label, y: value }));

  return (
    <Block height={3} width={5}>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10} height={450} width={750}>
        <VictoryLine
          style={{
            data: { stroke: '#c43a31', strokeWidth: '8px' },
            parent: { border: '1px solid #ccc' },
          }}
          data={victoryData}
        />
      </VictoryChart>
    </Block>
  );
};

export default LineChart;
