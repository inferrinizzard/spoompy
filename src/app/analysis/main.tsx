'use client';

import { type PlaylistTrackWithName } from '@/types/common';

import Count from '@/components/data/Count';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';

export interface AnalysisMainProps {
  playlists: PlaylistTrackWithName[];
}

export const AnalysisMain: React.FC<AnalysisMainProps> = ({ playlists }) => {
  return (
    <div>
      <Count value={playlists.length} caption="Total Tracks" />
      <BarChart
        data={playlists.reduce(
          (acc, { playlist }) => ({
            ...acc,
            [playlist]: (acc[playlist as keyof typeof acc] ?? 0) + 1,
          }),
          {}
        )}
      />
      <LineChart data={{ a: 1, b: 2, c: 3, d: 3, e: 2 }} />
    </div>
  );
};

export default AnalysisMain;
