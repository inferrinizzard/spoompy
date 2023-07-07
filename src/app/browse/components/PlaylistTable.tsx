'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { selectSlice, selectSort, setSort } from '@/redux/slices/browseSlice';

import { type PlaylistTrackWithName } from '@/types/common';

export interface PlaylistTableProps {
  playlists: PlaylistTrackWithName[];
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ playlists }) => {
  const dispatch = useAppDispatch();

  const sort = useAppSelector(selectSort);
  const slice = useAppSelector(selectSlice);

  const handleSort = (column: string) => {
    const nextSort = () => {
      if (sort?.column === column) {
        if (sort.asc) {
          return { column, asc: false };
        }
        return undefined;
      }
      return { column, asc: true };
    };

    dispatch(setSort(nextSort()));
  };

  const playlistSlice = playlists.slice(slice.index * slice.size, (slice.index + 1) * slice.size);

  return (
    <table>
      <thead>
        <tr>
          <th>{'Playlist'}</th>
          <th onClick={() => handleSort('name')}>{'Name'}</th>
          <th onClick={() => handleSort('artists')}>{'Artists'}</th>
          <th onClick={() => handleSort('album')}>{'Album'}</th>
          <th onClick={() => handleSort('time')}>{'Time'}</th>
          <th>{'ID'}</th>
          <th>{'Added by'}</th>
        </tr>
      </thead>
      <tbody>
        {playlistSlice.map(track => (
          <tr key={track.playlist + track.id}>
            <td>{track.playlist}</td>
            <td>{track.name}</td>
            <td>{track.artists}</td>
            <td>{track.album}</td>
            <td>{track.time}</td>
            <td>{track.id}</td>
            <td>{track.addedBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlaylistTable;
