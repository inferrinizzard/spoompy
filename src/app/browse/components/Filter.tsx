'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { setPlaylistFilter } from '@/redux/slices/browseSlice';
import { selectPlaylists } from '@/redux/slices/playlistSlice';

export interface FilterProps {}

const Filter: React.FC<FilterProps> = () => {
  const dispatch = useAppDispatch();

  const playlists = useAppSelector(selectPlaylists);

  return (
    <select onChange={(e) => dispatch(setPlaylistFilter(e.target.value))}>
      <option value="">{'All'}</option>
      {Object.values(playlists).map((playlist) => (
        <option key={playlist.id} value={playlist.id}>
          {playlist.name}
        </option>
      ))}
    </select>
  );
};

export default Filter;
