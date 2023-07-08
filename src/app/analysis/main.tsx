'use client';

import { useAppSelector } from '@/redux/client';
import { selectTracks } from '@/redux/slices/playlistSlice';
import { selectEndDate, selectStartDate, selectTimeStep } from '@/redux/slices/analysisSlice';

import Count from '@/components/data/Count';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';

import TimeControls from './components/TimeControls';
import { getRollingSumOfPlaylists } from './util';

export interface AnalysisMainProps {}

export const AnalysisMain: React.FC<AnalysisMainProps> = () => {
  const playlists = useAppSelector(selectTracks);

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const timeStep = useAppSelector(selectTimeStep);

  let loggedNum = 0;

  const playlistSlice = playlists.filter(track => {
    let include = true;
    if (startDate && track.time < startDate) {
      include = false;
    }
    if (endDate && track.time > endDate) {
      include = false;
    }

    if (loggedNum++ < 10) {
    }
    return include;
  });

  return (
    <div>
      <TimeControls />
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
      <LineChart datasets={getRollingSumOfPlaylists(playlistSlice, timeStep)} />
    </div>
  );
};

export default AnalysisMain;
