import {
  Bar,
  BarChart as RechartBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Block from '../Block';

export interface BarChartProps {
  data: Record<string, number>;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Block height={3} width={5}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartBarChart data={chartData}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="name" angle={45} />
          <YAxis dataKey="value" />
          <Tooltip labelStyle={{ color: 'black' }} />
          <Legend />
          <Bar dataKey="value" label fill="#82ca9d" />
        </RechartBarChart>
      </ResponsiveContainer>
    </Block>
  );
};

export default BarChart;
