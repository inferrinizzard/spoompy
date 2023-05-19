'use client';

import { type PlaylistTrackWithName } from '@/types/common';

import Count from '@/components/data/Count';

export interface AnalysisMainProps {
  playlists: PlaylistTrackWithName[];
}

export const AnalysisMain: React.FC<AnalysisMainProps> = ({ playlists }) => {
  return (
    <div>
      <Count value={playlists.length} caption="Total Tracks" />
    </div>
  );
};

export default AnalysisMain;
