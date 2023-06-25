'use client';

import React, { useMemo, useState } from 'react';

import { useAppSelector } from '@/redux/client';
import { selectPlaylistFilter } from '@/redux/slices/filterSlice';

import Search from '@/components/Search';
import { distinctBy } from '@/utils/query';
import { type PlaylistTrackWithName } from '@/types/common';

import Filter from './Filter';
import PlaylistTable from './PlaylistTable';
import Stepper from './Stepper';

export interface DisplayProps {
  playlists: PlaylistTrackWithName[];
}

const Display: React.FC<DisplayProps> = ({ playlists }) => {
  const playlistFilter = useAppSelector(selectPlaylistFilter);

  const [search, setSearch] = useState('');
  const [index, setIndex] = useState(0);
  const sliceLength = 50;
  const [sort, setSort] = useState<{ column: string; asc: boolean } | null>(null);

  const handleSearch = (str: string) => {
    setSearch(str.trim().toLowerCase());
    setIndex(0);
  };

  const transformedTracks = useMemo(
    () =>
      playlists
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
    [playlists, playlistFilter, search, sort]
  );

  return (
    <section>
      <Search handleSearch={handleSearch} />
      <Filter options={distinctBy(playlists, 'playlist') as string[]} />
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
