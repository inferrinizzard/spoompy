'use client';

import React, { useState } from 'react';

import { PlaylistTrack } from '@/types/common';

export interface DisplayProps {
  playlists: Record<string, PlaylistTrack[]>;
}

const Display: React.FC<DisplayProps> = ({ playlists }) => {
  const [search, setSearch] = useState('');
  const [playlist, setPlaylist] = useState('');

  const handleSearch = (str: string) => setSearch(str.trim().toLowerCase());

  const tracksWithPlaylist = Object.entries(playlists).reduce(
    (acc, [playlist, tracks]) =>
      acc.concat(tracks.map(track => Object.assign(track, { playlist }))),
    [] as ({ playlist: string } & PlaylistTrack)[]
  );

  const filterTracks = (tracks: typeof tracksWithPlaylist) =>
    tracks.filter(
      track =>
        [track.name, track.artists, track.album].some(key => key.toLowerCase().includes(search)) &&
        (playlist ? track.playlist === playlist : true)
    );

  return (
    <section>
      <input type="search" onChange={e => handleSearch(e.target.value)} />
      <select name="playlist-select" onChange={e => setPlaylist(e.target.value)}>
        <option value={''}>{'All'}</option>
        {Object.keys(playlists).map(playlist => (
          <option key={playlist} value={playlist}>
            {playlist}
          </option>
        ))}
      </select>
      <div>
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
            {filterTracks(tracksWithPlaylist.slice(0, 100)).map(track => (
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
      </div>
    </section>
  );
};

export default Display;
