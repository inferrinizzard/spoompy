'use client';

import { useAppDispatch, useAppSelector } from '@/redux/client';
import { selectSlice, selectSort, setSort } from '@/redux/slices/browseSlice';
import { selectAlbums, selectArtists, selectPlaylists } from '@/redux/slices/playlistSlice';

import { type PlaylistTrackEntityWithPlaylist } from '../TabularView';

export interface PlaylistTableProps {
  tracks: PlaylistTrackEntityWithPlaylist[];
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ tracks }) => {
  const dispatch = useAppDispatch();

  const playlists = useAppSelector(selectPlaylists);
  const artists = useAppSelector(selectArtists);
  const albums = useAppSelector(selectAlbums);

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

  const playlistSlice = tracks.slice(slice.index * slice.size, (slice.index + 1) * slice.size);

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
            <td>{playlists[track.playlist].name}</td>
            <td>{track.name}</td>
            <td>{track.artists.map(id => artists[id].name)}</td>
            <td>{albums[track.album].name}</td>
            <td>{track.added_at}</td>
            <td>{track.id}</td>
            <td>{track.added_by}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlaylistTable;
