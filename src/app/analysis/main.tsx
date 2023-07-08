'use client';

import { useAppSelector } from '@/redux/client';
import { selectTracks } from '@/redux/slices/playlistSlice';
import { selectEndDate, selectStartDate, selectTimeStep } from '@/redux/slices/analysisSlice';

import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import Count from '@/components/data/Count';
import TextBlock from '@/components/data/TextBlock';

import TimeControls from './components/TimeControls';
import { getRollingSumOfPlaylists } from './util';

import styles from './main.module.css';

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
    <section>
      <TimeControls />
      <div className={styles.grid}>
        <Count value={playlistSlice.length} caption={'Total Tracks'} />
        <TextBlock text={'Test'} caption={'Biggest Growing Playlist'} />
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
        <TextBlock text={'Month'} caption={'Most Active Month'} />
      </div>
    </section>
  );
};

export default AnalysisMain;
