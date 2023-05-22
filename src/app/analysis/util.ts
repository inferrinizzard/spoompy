import dayjs from 'dayjs';

import { type PlaylistTrackWithName } from '@/types/common';

export interface CountAggregation extends Record<string, unknown> {
  time: string;
  count: number;
}

type TimeResolution = 'day' | 'month' | 'year';

export const getRollingSumOfPlaylists = (
  slice: PlaylistTrackWithName[],
  timeResolution: TimeResolution = 'day'
) => {
  const trimmedDate = slice.map(track => ({
    ...track,
    time: trimDate(track.time, timeResolution),
  }));

  const groupedByPlaylists = groupBy(trimmedDate, 'playlist');

  const seriesData: Record<string, CountAggregation[]> = {};
  Object.entries(groupedByPlaylists).forEach(([playlist, tracks]) => {
    const frequency = countBy(tracks, 'time');

    const rollingSum = Object.entries(frequency)
      .sort()
      .reduce(
        ({ sum, data }, [key, count]) => ({
          sum: sum + count,
          data: data.concat([{ time: key, count: sum + count }]),
        }),
        { sum: 0, data: [] as CountAggregation[] }
      );

    seriesData[playlist] = rollingSum.data;
  });

  return seriesData;
};

export const trimDate = (dateString: string, timeResolution: TimeResolution) =>
  dayjs(dateString).startOf(timeResolution).toISOString();

export const groupBy = <T extends Record<PropertyKey, PropertyKey>>(tracks: T[], key: keyof T) =>
  tracks.reduce(
    (acc, track) => ({
      ...acc,
      [track[key]]: (acc[track[key]] ?? []).concat([track]),
    }),
    {} as Record<T[typeof key], T[]>
  );

export const countBy = <T extends Record<PropertyKey, PropertyKey>>(tracks: T[], key: keyof T) =>
  tracks.reduce(
    (acc, track) => ({
      ...acc,
      [track[key]]: (acc[track[key]] ?? 0) + 1,
    }),
    {} as Record<T[typeof key], number>
  );
