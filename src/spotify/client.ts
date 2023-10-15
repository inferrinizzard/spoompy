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

let spotify: ClientSpotifyInstance;

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

    return trimPlaylist(playlistObject, tracks);
  };
}

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

export const getSpotify = (): ClientSpotifyInstance => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = new ClientSpotifyInstance(spotifySdkConfig);
    } else {
      if (!global.spotify) {
        global.spotify = new ClientSpotifyInstance(spotifySdkConfig);
      }

      spotify = global.spotify as ClientSpotifyInstance;
    }
  }

  return spotify;
};
