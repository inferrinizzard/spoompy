import {
  ConsoleLoggingErrorHandler,
  type Playlist,
  type SdkOptions,
  SpotifyApi,
} from '@spotify/web-api-ts-sdk';

import { trimPlaylist, trimTrack } from '@/utils/normalizr/trim';
import {
  type PlaylistRef,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from '@/types/api';

import {
  REROUTE_HOME_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SCOPES,
} from './constants';
import { EntityCache } from './utils/entityCache';
import {
  buildPlaylistFields,
  buildTrackItemFields,
} from './utils/fieldBuilder';
import { RequestQueue } from './utils/requestQueue';

let clientSpotify: ClientSpotifyInstance;

export class ClientSpotifyInstance {
  private readonly sdkConfig: SdkOptions;

  public sdk: SpotifyApi;

  public cache: EntityCache;

  private readonly queue: RequestQueue;

  public constructor(apiConfig: SdkOptions = {}) {
    this.cache = new EntityCache();
    this.queue = new RequestQueue();

    this.sdkConfig = apiConfig;

    this.sdk = SpotifyApi.withUserAuthorization(
      SPOTIFY_CLIENT_ID,
      REROUTE_HOME_URL,
      SPOTIFY_SCOPES,
      this.sdkConfig,
    );
  }

  public getPlaylist = async (playlist: PlaylistRef): Promise<Playlist> => {
    const cacheSnapshot = this.cache.get<string>(playlist.id);

    // remove old cached playlistObj @ old snapshot if current playlist is no longer this snapshot
    if (cacheSnapshot && cacheSnapshot !== playlist.snapshotId) {
      this.cache.remove(cacheSnapshot);
    }

    const cachePlaylist = this.cache.get<Playlist>(playlist.snapshotId);
    if (cachePlaylist) {
      return cachePlaylist;
    }

    const playlistObject = await this.sdk.playlists.getPlaylist(
      playlist.id,
      undefined,
      buildPlaylistFields(true),
    );
    this.cache.set(playlist.id, playlist.snapshotId); // latest version of playlist @ playlist.id is this snapshot
    this.cache.set(playlistObject.snapshot_id, playlistObject);

    return playlistObject;
  };

  public getPlaylistWithTracks = async (
    playlist: PlaylistRef,
  ): Promise<SpotifyPlaylist> => {
    const playlistObject = await this.getPlaylist(playlist);

    if (playlistObject.tracks.total <= 100) {
      return trimPlaylist(playlistObject);
    }

    const numTracks = playlistObject.tracks.total;
    let tracks: SpotifyTrack[] = playlistObject.tracks.items.map(trimTrack);

    for (let i = 100; i < numTracks; i += 50) {
      const playlistSlice = await this.sdk.playlists.getPlaylistItems(
        playlist.id,
        undefined,
        `items(${buildTrackItemFields()})`,
        50,
        i,
      );

      tracks = tracks.concat(playlistSlice.items.map(trimTrack));
    }

    return trimPlaylist(playlistObject, tracks);
  };
}

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

export const getClientSpotify = (): ClientSpotifyInstance => {
  if (!clientSpotify) {
    if (process.env.NODE_ENV === 'production') {
      clientSpotify = new ClientSpotifyInstance(spotifySdkConfig);
    } else {
      if (!global.clientSpotify) {
        global.clientSpotify = new ClientSpotifyInstance(spotifySdkConfig);
      }

      clientSpotify = global.clientSpotify;
    }
  }

  return clientSpotify;
};
