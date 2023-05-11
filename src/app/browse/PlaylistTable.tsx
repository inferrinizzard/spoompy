'use client';

import { type PlaylistTrack } from '@/types/common';

export interface PlaylistTableProps {
  playlists: (PlaylistTrack & { playlist: string })[];
  setSort: React.Dispatch<
    React.SetStateAction<{
      column: string;
      asc: boolean;
    } | null>
  >;
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ playlists, setSort }) => {
  const handleSort = (column: string) =>
    setSort(prev => {
      if (prev?.column === column) {
        if (prev.asc) {
          return { column, asc: false };
        }
        return null;
      }
      return { column, asc: true };
    });

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
        {playlists.map(track => (
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
