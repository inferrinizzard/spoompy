'use client';

import React, { useMemo, useState } from 'react';

import { type PlaylistTrack } from '@/types/common';

import Search from '../../components/Search';
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
  const [sort, setSort] = useState<{ column: keyof typeof playlists; asc: boolean } | null>(null);

  const handleSearch = (str: string) => {
    setSearch(str.trim().toLowerCase());
    setIndex(0);
  };

  const tracksWithPlaylist = useMemo(
    () =>
      Object.entries(playlists).reduce(
        (acc, [playlist, tracks]) =>
          acc.concat(tracks.map(track => Object.assign(track, { playlist }))),
        [] as ({ playlist: string } & PlaylistTrack)[]
      ),
    [playlists]
  );

  const transformedTracks = useMemo(
    () =>
      tracksWithPlaylist
        .filter(
          track =>
            [track.name, track.artists, track.album].some(key =>
              key.toLowerCase().includes(search)
            ) && (playlistFilter ? track.playlist === playlistFilter : true)
        )
        .sort(
          !sort
            ? undefined
            : (a, b) =>
                (a[sort.column as keyof typeof a]! > b[sort.column as keyof typeof b]! ? 1 : -1) *
                (sort.asc ? 1 : -1)
        ),
    [tracksWithPlaylist, playlistFilter, search, sort]
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
        totalLength={transformedTracks.length}
      />
      <div>
        <PlaylistTable
          playlists={transformedTracks.slice(index * sliceLength, (index + 1) * sliceLength)}
          setSort={setSort}
        />
      </div>
    </section>
  );
};

export default Display;
