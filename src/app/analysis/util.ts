import dayjs from 'dayjs';

import { type TimeStep, type PlaylistTrackWithName } from '@/types/common';

export const getRollingSumOfPlaylists = (
  slice: PlaylistTrackWithName[],
  timeResolution: TimeStep = 'day'
) => {
  const sortedSlice = slice.sort((a, b) => (a.time > b.time ? 1 : -1));

  let playlistCounters: Record<string, number> = {};
  let seriesData = [];
  let lastDateItem: Record<string, string | number> = {};

  for (const track of sortedSlice) {
    playlistCounters[track.playlist] = (playlistCounters[track.playlist] ?? 0) + 1;
    const trimmedDate = trimDate(track.time, 'day');

    if (!lastDateItem.date) {
      lastDateItem = { date: trimmedDate };
    }

    if (trimmedDate > lastDateItem.date) {
      lastDateItem.count = Object.values(playlistCounters).reduce((max, cur) => Math.max(max, cur));
      seriesData.push(lastDateItem);
      lastDateItem = { date: trimmedDate };
    }
    lastDateItem[track.playlist] = playlistCounters[track.playlist];
  }
  lastDateItem.count = Object.values(playlistCounters).reduce((max, cur) => Math.max(max, cur), 0);
  seriesData.push(lastDateItem);

  return { data: seriesData, keys: Object.keys(playlistCounters) };
};

export const trimDate = (dateString: string, timeResolution: TimeStep) =>
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
