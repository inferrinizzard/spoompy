import { VictoryChart, VictoryTheme, VictoryBar } from 'victory';

import Block from '../Block';

export interface BarChartProps {
  data: Record<string, number>;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const victoryData = Object.entries(data).map(([label, value]) => ({ x: label, y: value }));

  return (
    <Block height={3} width={5}>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10} height={450} width={750}>
        <VictoryBar
          style={{ data: { fill: '#c43a31' } }}
          data={victoryData}
          labels={({ datum }) => datum.y}
        />
      </VictoryChart>
    </Block>
  );
};

export default BarChart;
