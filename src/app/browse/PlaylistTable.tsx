'use client';

import { type PlaylistTrack } from '@/types/common';

export interface PlaylistTableProps {
  playlists: (PlaylistTrack & { playlist: string })[];
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ playlists }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{'Playlist'}</th>
          <th>{'Name'}</th>
          <th>{'Artists'}</th>
          <th>{'Album'}</th>
          <th>{'Time'}</th>
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
