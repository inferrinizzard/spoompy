import dayjs from 'dayjs';

import { useAppSelector } from '@/redux/client';
import { selectTracks, type PlaylistState } from '@/redux/slices/playlistSlice';
import { countBy } from '@/utils/query';
import { type TimeStep } from '@/types/common';
import { type ValueOf } from '@/types/util';

export interface CountAggregation {
  x: Date;
  y: number;
}

export const useRollingSumOfPlaylists = (
  slice: ValueOf<PlaylistState['playlists']>[],
  timeResolution: TimeStep = 'day'
) => {
  const tracks = useAppSelector(selectTracks);

  return slice.reduce((acc, playlist) => {
    const playlistTracks = playlist.tracks
      .map(track => {
        const trackData = tracks[track];
        const playlistReference = trackData.playlists[playlist.id];
        return {
          ...trackData,
          added_at: trimDate(playlistReference.added_at, timeResolution),
          added_by: playlistReference.added_by,
        };
      })
      .sort((a, b) => (a.added_at > b.added_at ? 1 : -1));

    const frequency = countBy(playlistTracks, 'added_at');

    const rollingSum = Object.entries(frequency).reduce(
      ({ sum, data }, [time, count]) => ({
        sum: sum + count,
        data: data.concat([{ x: new Date(time), y: sum + count }]),
      }),
      { sum: 0, data: [] as CountAggregation[] }
    ).data;

    return { ...acc, [playlist.id]: rollingSum };
  }, {} as Record<string, CountAggregation[]>);
};

export const trimDate = (dateString: string, timeResolution: TimeStep) =>
  dayjs(dateString).startOf(timeResolution).toISOString();
