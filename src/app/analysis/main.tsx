'use client';

import { type PlaylistTrackWithName } from '@/types/common';

import Count from '@/components/data/Count';
import BarChart from '@/components/charts/BarChart';

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
    </div>
  );
};

export default AnalysisMain;
