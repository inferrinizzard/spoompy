import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Block from '../Block';

export interface LineChartProps<Datum extends Record<string, string | number>> {
  data: Datum[];
  keys: (keyof Datum & string)[];
}

export const LineChart = <Datum extends Record<string, string | number>>({
  data,
  keys,
}: LineChartProps<Datum>) => {
  return (
    <Block height={3} width={5}>
      <ResponsiveContainer>
        <RechartLineChart data={data}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="date" angle={45} />
          <YAxis dataKey="count" />
          <Tooltip labelStyle={{ color: 'black' }} />
          <Legend />
          {keys.map(key => (
            <Line key={key} type="monotone" dataKey={key} label fill="#82ca9d" />
          ))}
        </RechartLineChart>
      </ResponsiveContainer>
    </Block>
  );
};

export default LineChart;
