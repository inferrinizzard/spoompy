import {
  ConsoleLoggingErrorHandler,
  type SdkOptions,
  SpotifyApi,
  type User,
} from '@spotify/web-api-ts-sdk';

import { trimPlaylist, trimTrack } from '@/utils/normalizr/trim';
import { type SpotifyPlaylist, type SpotifyTrack } from '@/types/api';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_POSTBACK_URL,
  SPOTIFY_SCOPES,
} from './constants';

let clientSpotify: ClientSpotifyInstance;

export class ClientSpotifyInstance {
  public sdk: SpotifyApi;

  public refreshTimer?: ReturnType<typeof setTimeout>;

  private readonly sdkConfig: SdkOptions;

  public constructor(apiConfig: SdkOptions = {}) {
    this.sdkConfig = apiConfig;

    const sdk = SpotifyApi.withUserAuthorization(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_POSTBACK_URL,
      SPOTIFY_SCOPES,
      this.sdkConfig,
    );

    this.sdk = sdk;
  }

  public getPlaylistWithTracks = async (
    playlistId: string,
  ): Promise<SpotifyPlaylist> => {
    if (!this.sdk) {
      throw new Error('SDK not initialised!');
    }

    const playlistObject = await this.sdk.playlists.getPlaylist(playlistId);

    const numTracks = playlistObject.tracks.total;

    let tracks: SpotifyTrack[] = [];
    for (let i = 0; i < numTracks; i += 50) {
      const playlistSlice = await this.sdk.playlists.getPlaylistItems(
        playlistId,
        undefined,
        undefined,
        50,
        i,
      );

      tracks = tracks.concat(
        playlistSlice.items.map((track) => trimTrack(track)),
      );
    }

    return trimPlaylist(playlistObject, tracks);
  };
}

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

export const getSpotify = (): ClientSpotifyInstance => {
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
