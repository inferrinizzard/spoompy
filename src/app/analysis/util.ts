import dayjs from 'dayjs';

import { type TimeStep, type PlaylistTrackWithName } from '@/types/common';

export interface CountAggregation {
  x: Date;
  y: number;
}

export const getRollingSumOfPlaylists = (
  slice: PlaylistTrackWithName[],
  timeResolution: TimeStep = 'day'
) => {
  const trimmedDate = slice
    .sort((a, b) => (a.time > b.time ? 1 : -1))
    .map(track => ({
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
        ({ sum, data }, [time, count]) => ({
          sum: sum + count,
          data: data.concat([{ x: new Date(time), y: sum + count }]),
        }),
        { sum: 0, data: [] as CountAggregation[] }
      );

    seriesData[playlist] = rollingSum.data;
  });

  return seriesData;
};

export const trimDate = (dateString: string, timeResolution: TimeStep) =>
  dayjs(dateString).startOf(timeResolution).toISOString();
