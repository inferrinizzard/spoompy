import {
  ConsoleLoggingErrorHandler,
  type SdkOptions,
  SpotifyApi,
  type User,
} from '@spotify/web-api-ts-sdk';

import { tryGetAuthSession } from './util';
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from './constants';

let serverSpotify: ServerSpotifyInstance;

export class ServerSpotifyInstance {
  public sdk: SpotifyApi;

  public refreshTimer?: ReturnType<typeof setTimeout>;

  private readonly sdkConfig: SdkOptions;

  public constructor(apiConfig: SdkOptions = {}) {
    this.sdkConfig = apiConfig;

    let sdk;
    const authSession = tryGetAuthSession();
    try {
      if (authSession) {
        console.log('TRY with PKCE');
        sdk = SpotifyApi.withAccessToken(
          SPOTIFY_CLIENT_ID,
          authSession,
          this.sdkConfig,
        );
      }
    } finally {
      if (!sdk) {
        console.log('CC fallback');
        sdk = SpotifyApi.withClientCredentials(
          SPOTIFY_CLIENT_ID,
          process.env.SPOTIFY_SECRET ?? '',
          SPOTIFY_SCOPES,
        );
      }
    }

    this.sdk = sdk;
  }

  public getUserDetails = async (): Promise<User> => {
    if (!this.sdk) {
      throw new Error('SDK not initialised!');
    }

    return await this.sdk.currentUser.profile();
  };

  public getUserPlaylists = async (userId: string): Promise<string[]> => {
    if (!this.sdk) {
      throw new Error('SDK not initialised!');
    }

    const firstSlice = await this.sdk.playlists
      .getUsersPlaylists(userId, 50)
      .then((playlistPage) => ({
        ...playlistPage,
        items: playlistPage.items.filter(
          (playlist) => playlist.owner.id === userId,
        ), // filter only for playlists that belong to userId
      }));

    const numPlaylists = firstSlice.total;

    let playlists = firstSlice.items.map((playlist) => playlist.id);
    for (let i = 50; i < numPlaylists; i += 50) {
      const playlistSlice = await this.sdk.playlists
        .getUsersPlaylists(userId, 50, i)
        .then((playlistPage) =>
          playlistPage.items
            .filter((playlist) => playlist.owner.id === userId) // filter only for playlists that belong to userId
            .map((playlist) => playlist.id),
        );

      playlists = playlists.concat(playlistSlice);
    }

    return playlists;
  };
}

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

export const getServerSpotify = (): ServerSpotifyInstance => {
  if (!serverSpotify) {
    if (process.env.NODE_ENV === 'production') {
      serverSpotify = new ServerSpotifyInstance(spotifySdkConfig);
    } else {
      if (!global.serverSpotify) {
        global.serverSpotify = new ServerSpotifyInstance(spotifySdkConfig);
      }

      serverSpotify = global.serverSpotify;
    }
  }

  return serverSpotify;
};
