import { type PlaylistTrackWithName } from '@/types/common';

import Filter from './components/Filter';
import Search from './components/Search';
import Stepper from './components/Stepper';
import PlaylistTable from './components/PlaylistTable';

export interface TabularViewProps {
  playlists: PlaylistTrackWithName[];
}

export const TabularView = ({ playlists }: TabularViewProps) => {
  return (
    <section>
      <Search />
      <Filter />
      <Stepper totalLength={playlists.length} />
      <div>
        <PlaylistTable playlists={playlists} />
      </div>
    </section>
  );
};

export default TabularView;
