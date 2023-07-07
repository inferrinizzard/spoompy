'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { setPlaylistFilter } from '@/redux/slices/browseSlice';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

export interface FilterProps {}

const Filter: React.FC<FilterProps> = () => {
  const dispatch = useAppDispatch();

  const playlists = useAppSelector(selectPlaylists);

  return (
    <select onChange={e => dispatch(setPlaylistFilter(e.target.value))}>
      <option value={''}>{'All'}</option>
      {playlists.map(playlist => (
        <option key={playlist.id} value={playlist.name}>
          {/* // TODO: use id as value in case of duplicate names */}
          {playlist.name}
        </option>
      ))}
    </select>
  );
};

export default Filter;
