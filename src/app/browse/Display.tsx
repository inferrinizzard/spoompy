'use client';

import React, { useState } from 'react';

import { type PlaylistTrack } from '@/types/common';

import Search from './Search';
import Filter from './Filter';
import PlaylistTable from './PlaylistTable';
import Stepper from './Stepper';

export interface DisplayProps {
  playlists: Record<string, PlaylistTrack[]>;
}

const Display: React.FC<DisplayProps> = ({ playlists }) => {
  const [search, setSearch] = useState('');
  const [playlistFilter, setPlaylistFilter] = useState('');
  const [index, setIndex] = useState(0);
  const sliceLength = 50;

  const handleSearch = (str: string) => {
    setSearch(str.trim().toLowerCase());
    setIndex(0);
  };

  const tracksWithPlaylist = Object.entries(playlists).reduce(
    (acc, [playlist, tracks]) =>
      acc.concat(tracks.map(track => Object.assign(track, { playlist }))),
    [] as ({ playlist: string } & PlaylistTrack)[]
  );

  const filterTracks = (tracks: typeof tracksWithPlaylist) =>
    tracks.filter(
      track =>
        [track.name, track.artists, track.album].some(key => key.toLowerCase().includes(search)) &&
        (playlistFilter ? track.playlist === playlistFilter : true)
    );

  return (
    <section>
      <Search handleSearch={handleSearch} />
      <Filter
        options={Object.keys(playlists)}
        setOption={option => {
          setPlaylistFilter(option);
          setIndex(0);
        }}
      />
      <Stepper
        index={index}
        setIndex={setIndex}
        stepSize={sliceLength}
        totalLength={tracksWithPlaylist.length}
      />
      <div>
        <PlaylistTable
          playlists={filterTracks(
            tracksWithPlaylist.slice(index * sliceLength, (index + 1) * sliceLength)
          )}
        />
      </div>
    </section>
  );
};

export default Display;
