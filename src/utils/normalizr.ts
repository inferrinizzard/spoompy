import { type SpotifyPlaylist, type SpotifyTrack } from '@/types/api';
import { normalize, schema } from 'normalizr';

const artistSchema = new schema.Entity('artists');

const albumSchema = new schema.Entity('albums');

const trackSchema = new schema.Entity(
  'tracks',
  {
    album: albumSchema,
    artists: [artistSchema],
  },
  {
    processStrategy: (
      trackWithPlaylists: SpotifyTrack & { playlists?: Record<string, string> },
      parentPlaylist: SpotifyPlaylist
    ) => {
      const { added_at, added_by, ...rest } = trackWithPlaylists;

      return {
        ...rest,
        playlists: {
          ...trackWithPlaylists.playlists,
          [parentPlaylist.id]: { added_at, added_by },
        },
      };
    },
  }
);

const playlistSchema = new schema.Entity('playlists', {
  tracks: [trackSchema],
});

const playlistArray = new schema.Array(playlistSchema);

export const normalizePlaylist = (playlist: SpotifyPlaylist) => normalize(playlist, playlistSchema);

export const normalizePlaylists = (playlist: SpotifyPlaylist[]) =>
  normalize(playlist, playlistArray);
