'use client';

import { useAppSelector } from '@/redux/client';
import { selectTracks } from '@/redux/slices/playlistSlice';
import { selectEndDate, selectStartDate, selectTimeStep } from '@/redux/slices/analysisSlice';

import Count from '@/components/data/Count';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';

import TimeControls from './components/TimeControls';
import { type CountAggregation, getRollingSumOfPlaylists } from './util';

export interface AnalysisMainProps {}

export const AnalysisMain: React.FC<AnalysisMainProps> = () => {
  const tracks = useAppSelector(selectTracks);

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const timeStep = useAppSelector(selectTimeStep);

  const tracksSlice = Object.values(tracks).filter(track => {
    const trackPlaylists = Object.values(track.playlists);

    let include = true;
    if (startDate && trackPlaylists.some(playlist => playlist.added_at < startDate)) {
      include = false;
    }
    if (endDate && trackPlaylists.some(playlist => playlist.added_at > endDate)) {
      include = false;
    }

    return include;
  });

  return (
    <div>
      <TimeControls />
      <Count value={tracksSlice.length} caption={`Total Tracks`} />
      <BarChart
        data={tracksSlice.reduce((acc, { playlists }) => {
          let newTrack = acc;
          Object.keys(playlists).forEach(key => (newTrack[key] = (newTrack[key] ?? 0) + 1));
          return newTrack;
        }, {} as Record<string, number>)}
      />
      <LineChart<CountAggregation>
        datasets={getRollingSumOfPlaylists(tracksSlice, timeStep)}
        x="time"
        y="count"
      />
    </div>
  );
};

export default AnalysisMain;
