import {
  ConsoleLoggingErrorHandler,
  LocalStorageCachingStrategy,
  type Playlist,
  type SdkOptions,
  SpotifyApi,
} from '@spotify/web-api-ts-sdk';

import { trimPlaylist, trimTrack } from '@/utils/normalizr/trim';
import {
  type PlaylistRef,
  type PlaylistTracksRef,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from '@/types/api';
import { type CacheResult } from '@/types/util';

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
import { type RequestBatch, RequestQueue } from './utils/requestQueue';

let clientSpotify: ClientSpotifyInstance | null;

export class ClientSpotifyInstance {
  private readonly sdkConfig: SdkOptions;

  public sdk: SpotifyApi;

  public cache: EntityCache;

  private readonly queue: RequestQueue;

  public constructor(apiConfig: SdkOptions = {}) {
    this.cache = new EntityCache();
    this.queue = new RequestQueue();

    this.sdkConfig = {
      ...apiConfig,
      cachingStrategy: new LocalStorageCachingStrategy(),
    };

    this.sdk = SpotifyApi.withUserAuthorization(
      SPOTIFY_CLIENT_ID,
      REROUTE_HOME_URL,
      SPOTIFY_SCOPES,
      this.sdkConfig,
    );
  }

  public getPlaylist = async (playlist: PlaylistRef): Promise<Playlist> => {
    const cacheResult = this._getPlaylist(playlist);

    if (cacheResult.cache) {
      return cacheResult.data;
    }

    return await cacheResult.promise;
  };

  private readonly _getPlaylist = (
    playlist: PlaylistRef,
  ): CacheResult<Playlist> => {
    try {
      const cacheSnapshot = this.cache.get<string>(playlist.id);

      // remove old cached playlistObj @ old snapshot if current playlist is no longer this snapshot
      if (cacheSnapshot && cacheSnapshot !== playlist.snapshotId) {
        this.cache.remove(cacheSnapshot);
      }

      const cachePlaylist = this.cache.get<Playlist>(playlist.snapshotId);
      if (cachePlaylist) {
        return { cache: true, data: cachePlaylist };
      }
    } catch {
      console.log(
        'Error in retrieving cache for:',
        playlist.id,
        '@',
        playlist.snapshotId,
      );
    }

    const promise = this.sdk.playlists
      .getPlaylist(playlist.id, undefined, buildPlaylistFields(true))
      .then((playlistObject) => {
        this.cache.set(playlist.id, playlist.snapshotId); // latest version of playlist @ playlist.id is this snapshot
        this.cache.set(playlistObject.snapshot_id, playlistObject);
        return playlistObject;
      });

    return { cache: false, promise };
  };

  public getAllPlaylists = async (
    playlists: PlaylistRef[],
  ): Promise<RequestBatch<SpotifyPlaylist>> => {
    let thunkIds: string[] = [];
    let cachedPlaylists: SpotifyPlaylist[] = [];

    for (const playlist of playlists) {
      const playlistCacheResult = this._getPlaylist(playlist);

      if (playlistCacheResult.cache) {
        cachedPlaylists.push(trimPlaylist(playlistCacheResult.data));
        continue;
      }

      const getPlaylistThunk = async (): Promise<SpotifyPlaylist> =>
        await playlistCacheResult.promise.then(trimPlaylist);
      const getPlaylistId = this.queue.add(getPlaylistThunk);
      thunkIds.push(getPlaylistId);
    }

    console.info(
      `[SDK] Found ${cachedPlaylists.length} of ${playlists.length} playlists in cache`,
    );

    const getFirstAsyncBatch = async () =>
      await this.queue.runBatch<SpotifyPlaylist>(thunkIds);
    return { data: cachedPlaylists, next: getFirstAsyncBatch };
  };

  public getPlaylistTracks = async (
    playlistTrackRequests: Array<{ id: string; offset: number }>,
  ): Promise<RequestBatch<PlaylistTracksRef>> => {
    let thunkIds = [];

    for (const trackRequest of playlistTrackRequests) {
      const getPlaylistTracksThunk = async (): Promise<PlaylistTracksRef> =>
        await this.sdk.playlists
          .getPlaylistItems(
            trackRequest.id,
            undefined,
            `items(${buildTrackItemFields()})`,
            50,
            trackRequest.offset,
          )
          .then((res) => ({
            playlistId: /playlists[/](.+)[/]/.exec(res.href)?.[1] ?? '', // TODO: semi-brittle
            tracks: res.items.map(trimTrack),
          }));

      const getPlaylistTracksId = this.queue.add(getPlaylistTracksThunk);
      thunkIds.push(getPlaylistTracksId);
    }

    return await this.queue.runBatch<PlaylistTracksRef>(thunkIds);
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
    console.log('NEW CLIent INSTANCE');
    if (process.env.NODE_ENV === 'production') {
      clientSpotify = new ClientSpotifyInstance(spotifySdkConfig);
    } else {
      if (!global.clientSpotify) {
        global.clientSpotify = new ClientSpotifyInstance(spotifySdkConfig);
      }

      clientSpotify = global.clientSpotify;
    }
  }

  return clientSpotify as ClientSpotifyInstance;
};

export const clientSpotifyLogout = (): void => {
  clientSpotify?.sdk.logOut();
  // clientSpotify. // clear queue
  clientSpotify = null;
  if (process.env.NODE_ENV !== 'production') {
    global.clientSpotify = null as unknown as ClientSpotifyInstance;
  }

  console.log(clientSpotify, global.clientSpotify);
};
