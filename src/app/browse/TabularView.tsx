'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/redux/client';
import { selectPlaylistFilter, selectSearch, selectSort } from '@/redux/slices/browseSlice';
import { selectAlbums, selectArtists, selectTracks } from '@/redux/slices/playlistSlice';
import { type PlaylistTrackEntityWithNormalizedArtistsAndAlbums } from '@/types/schema';

import Filter from './components/Filter';
import Search from './components/Search';
import Stepper from './components/Stepper';
import PlaylistTable from './components/PlaylistTable';

export interface PlaylistTrackEntityWithPlaylist
  extends PlaylistTrackEntityWithNormalizedArtistsAndAlbums {
  playlist: string;
}

export interface TabularViewProps {}

export const TabularView = () => {
  const tracks = useAppSelector(selectTracks);
  const artists = useAppSelector(selectArtists);
  const albums = useAppSelector(selectAlbums);

  const playlistFilter = useAppSelector(selectPlaylistFilter);

  const search = useAppSelector(selectSearch);
  const sort = useAppSelector(selectSort);

  const transformedTracks = useMemo(
    () =>
      Object.values(tracks)
        .reduce((list, track) => {
          const hasSearchKey = [
            track.name,
            ...track.artists.map(id => artists[id].name),
            albums[track.album].name,
          ].some(key => key.toLowerCase().includes(search));

          const matchingPlaylist = Object.entries(track.playlists).find(
            ([id]) => id === playlistFilter
          );

          if (hasSearchKey && matchingPlaylist) {
            const { playlists, ...rest } = track;

            return list.concat([
              { ...rest, playlist: matchingPlaylist[0], ...matchingPlaylist[1] },
            ]);
          }

          return list;
        }, [] as PlaylistTrackEntityWithPlaylist[])
        .sort(
          !sort
            ? undefined
            : (a, b) =>
                (a[sort.column as keyof typeof a]! > b[sort.column as keyof typeof b]! ? 1 : -1) *
                (sort.asc ? 1 : -1)
        ),
    [albums, artists, tracks, playlistFilter, search, sort]
  );

  return (
    <>
      <div>
        <Search />
        <Filter />
        <Stepper totalLength={transformedTracks.length} />
      </div>
      <section>
        <PlaylistTable tracks={transformedTracks} />
      </section>

      {/* <section>
      <Stepper
        totalLength={transformedTracks.length}
      />
      <div>
        <PlaylistTable
          playlists={transformedTracks.slice(index * sliceLength, (index + 1) * sliceLength)}
        />
      </div>
    </section> */}
    </>
  );
};

export default TabularView;
