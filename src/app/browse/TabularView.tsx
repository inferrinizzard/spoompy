import { type PlaylistTrackWithName } from '@/types/common';

import Filter from './components/Filter';
import Search from './components/Search';
import Stepper from './components/Stepper';
import PlaylistTable from './components/PlaylistTable';

export interface TabularViewProps {
  playlists: PlaylistTrackWithName[]; // TODO: remove prop drilling
}

export const TabularView = ({ playlists }: TabularViewProps) => {
  return (
    <>
      <div>
        <Search />
        <Filter />
        <Stepper totalLength={playlists.length} />
      </div>
      <section>
        <PlaylistTable playlists={playlists} />
      </section>
    </>
  );
};

export default TabularView;
