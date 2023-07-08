'use client';

import React, { useMemo, useState } from 'react';

import { useAppSelector } from '@/redux/client';
import {
  selectPlaylistFilter,
  selectSearch,
  selectSlice,
  selectSort,
} from '@/redux/slices/browseSlice';
import { selectTracks } from '@/redux/slices/playlistSlice';

import TabularView from './TabularView';
import PlaylistView from './PlaylistView';

export interface DisplayProps {}

const BrowseMain: React.FC<DisplayProps> = () => {
  const playlists = useAppSelector(selectTracks);
  const playlistFilter = useAppSelector(selectPlaylistFilter);

  const search = useAppSelector(selectSearch);
  const sort = useAppSelector(selectSort);

  const [view, setView] = useState<'tabular' | 'playlist'>('tabular');

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
    <>
      <button
        onClick={() => {
          view === 'playlist' ? setView('tabular') : setView('playlist');
        }}>
        {'Switch View'}
      </button>
      {view === 'playlist' && <PlaylistView />}
      {view === 'tabular' && <TabularView playlists={transformedTracks} />}
    </>
  );
};

export default BrowseMain;
