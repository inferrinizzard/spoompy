import { cookies } from 'next/headers';
import {
  ConsoleLoggingErrorHandler,
  type SdkOptions,
  SpotifyApi,
  type User,
} from '@spotify/web-api-ts-sdk';
import SpotifyWebApiNode from 'spotify-web-api-node';

import { trimTrack } from '@/api/utils/track';
import {
  type AuthSession,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from '@/types/api';

import { tryGetAuthSession } from './util';
import { SPOTIFY_AUTH_COOKIE } from './constants';

type SpotifyParams = ConstructorParameters<typeof SpotifyWebApiNode>[0];

let spotify: SpotifyInstance;

export class SpotifyInstance {
  public api: SpotifyWebApiNode;

  public sdk: SpotifyApi | null = null;

  public refreshTimer?: ReturnType<typeof setTimeout>;

  private readonly params: SpotifyParams;

  private readonly sdkConfig: SdkOptions;

  public constructor(apiConfig: SdkOptions = {}) {
    this.sdkConfig = apiConfig;

    let spotifyApiParams: SpotifyParams = {
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      redirectUri: 'http://localhost:3000/api/login',
      // accessToken: undefined,
      // refreshToken: undefined,
    };

    const authSession = tryGetAuthSession();
    console.log({ authSession });
    if (authSession) {
      if (authSession.expiresAt > new Date().getTime()) {
        spotifyApiParams.accessToken = authSession.accessToken;
        spotifyApiParams.refreshToken = authSession.refreshToken;

        this.refreshTimer = setTimeout(async () => {
          await this.refreshToken();
        }, Math.max(0, authSession.expiresIn - 100) * 1000);
      }

      this.sdk = SpotifyApi.withAccessToken(
        spotifyApiParams.clientId ?? '',
        {
          access_token: authSession.accessToken,
          token_type: authSession.tokenType,
          refresh_token: authSession.refreshToken,
          expires: authSession.expiresAt,
          expires_in: authSession.expiresIn,
        },
        apiConfig,
      );
    }

    this.api = new SpotifyWebApiNode(spotifyApiParams);

    this.params = spotifyApiParams;
  }

  public startSdk = (): boolean => {
    const authSession = tryGetAuthSession();
    if (authSession) {
      this.sdk = SpotifyApi.withAccessToken(
        this.params?.clientId ?? '',
        {
          access_token: authSession.accessToken,
          token_type: authSession.tokenType,
          refresh_token: authSession.refreshToken,
          expires: authSession.expiresAt,
          expires_in: authSession.expiresIn,
        },
        this.sdkConfig,
      );

      return true;
    }

    return false;
  };

  public refreshToken = async (): Promise<void> =>
    await this.api.refreshAccessToken().then(({ body }) => {
      this.api.setAccessToken(body.access_token);
      if (body.refresh_token) {
        this.api.setRefreshToken(body.refresh_token);
      }

      const authSession = tryGetAuthSession();
      if (!authSession) {
        throw new Error('Invalid authSession on refreshToken!');
      }

      const newAuthSession: AuthSession = {
        ...authSession,
        accessToken: body.access_token,
        refreshToken: body.refresh_token ?? authSession.refreshToken,
        expiresIn: body.expires_in,
        expiresAt: new Date(
          new Date().getTime() + body.expires_in * 1000,
        ).getTime(),
      };

      cookies().set(SPOTIFY_AUTH_COOKIE, JSON.stringify(newAuthSession), {
        maxAge: newAuthSession.expiresIn,
      });

      this.refreshTimer = setTimeout(
        async () => await this.refreshToken(),
        Math.max(0, body.expires_in - 100) * 1000,
      );
    });

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

    return {
      ...playlistObject,
      tracks,
    };
  };
}

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

export const getSpotify = (): SpotifyInstance => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = new SpotifyInstance(spotifySdkConfig);
    } else {
      if (!global.spotify) {
        global.spotify = new SpotifyInstance(spotifySdkConfig);
      }

      spotify = global.spotify;
    }
  }

  if (!spotify.sdk) {
    spotify.startSdk();
  }

  return spotify;
};
