'use client';

import dayjs from 'dayjs';

import { useAppSelector } from '@/redux/client';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

import Count from '@/components/data/Count';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';

import { CountAggregation, getRollingSumOfPlaylists } from './util';

export interface AnalysisMainProps {}

export const AnalysisMain: React.FC<AnalysisMainProps> = () => {
  const playlists = useAppSelector(selectPlaylists);

  const startDate = dayjs().subtract(90, 'days').toISOString();

  const playlistSlice = playlists.filter(track => track.time > startDate);

  return (
    <div>
      <Count value={playlistSlice.length} caption={`Total Tracks`} />
      <BarChart
        data={playlistSlice.reduce(
          (acc, { playlist }) => ({
            ...acc,
            [playlist]: (acc[playlist as keyof typeof acc] ?? 0) + 1,
          }),
          {}
        )}
      />
      <LineChart<CountAggregation>
        datasets={getRollingSumOfPlaylists(playlistSlice)}
        x="time"
        y="count"
      />
    </div>
  );
};

export default AnalysisMain;
