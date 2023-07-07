'use client';

import React, { useMemo, useState } from 'react';

import { useAppSelector } from '@/redux/client';
import { selectPlaylistFilter, selectSearch, selectSort } from '@/redux/slices/browseSlice';
import { selectTracks } from '@/redux/slices/playlistSlice';

import { distinctBy } from '@/utils/query';

import Filter from './components/Filter';
import PlaylistTable from './components/PlaylistTable';
import Stepper from './components/Stepper';
import Search from './components/Search';

export interface DisplayProps {}

const BrowseMain: React.FC<DisplayProps> = () => {
  const playlists = useAppSelector(selectTracks);
  const playlistFilter = useAppSelector(selectPlaylistFilter);

  const search = useAppSelector(selectSearch);
  const sort = useAppSelector(selectSort);

  const [index, setIndex] = useState(0);
  const sliceLength = 50;

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
      <Search />
      <Filter options={distinctBy(playlists, 'playlist')} />
      <Stepper
        index={index}
        setIndex={setIndex}
        stepSize={sliceLength}
        totalLength={transformedTracks.length}
      />
      <div>
        <PlaylistTable
          playlists={transformedTracks.slice(index * sliceLength, (index + 1) * sliceLength)}
        />
      </div>
    </section>
  );
};

export default BrowseMain;
