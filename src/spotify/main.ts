import { cookies } from 'next/headers';
import SpotifyWebApiNode from 'spotify-web-api-node';

import { trimTrack } from '@/api/utils/track';
import {
  type AuthSession,
  type SpotifyPlaylist,
  type SpotifyTrack,
  type UserDetails,
} from '@/types/api';

import { tryGetAuthSession } from './util';
import { handleRateLimitedError, throwError } from './handlers';

let spotify: SpotifyInstance;

export class SpotifyInstance {
  public api: SpotifyWebApiNode;

  public refreshTimer?: ReturnType<typeof setTimeout>;

  public constructor() {
    let spotifyApiParams: ConstructorParameters<typeof SpotifyWebApiNode>[0] = {
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      redirectUri: 'http://localhost:3000/api/login',
      // accessToken: undefined,
      // refreshToken: undefined,
    };

    const authSession = tryGetAuthSession();
    if (authSession) {
      if (authSession.expiresAt > new Date().getTime()) {
        spotifyApiParams.accessToken = authSession.accessToken;
        spotifyApiParams.refreshToken = authSession.refreshToken;

        this.refreshTimer = setTimeout(async () => {
          await this.refreshToken();
        }, Math.max(0, authSession.expiresIn - 100) * 1000);
      }
    }

    this.api = new SpotifyWebApiNode(spotifyApiParams);
  }

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

      cookies().set('AUTH_SESSION', JSON.stringify(newAuthSession));

      this.refreshTimer = setTimeout(
        async () => await this.refreshToken(),
        Math.max(0, body.expires_in - 100) * 1000,
      );
    });

  public getUserDetails = async (): Promise<UserDetails> =>
    await this.api
      .getMe()
      .then(handleRateLimitedError)
      .then(({ body }) => ({
        name: body.display_name ?? '',
        id: body.id,
        image: body.images?.at(0)?.url ?? '', // TODO: add default profile image url
      }))
      .catch(throwError);

  public getUserPlaylists = async (userId: string): Promise<string[]> => {
    const firstSlice = await this.api
      .getUserPlaylists(userId, { limit: 50 })
      .then(handleRateLimitedError)
      .then(({ body }) => ({
        ...body,
        items: body.items.filter((playlist) => playlist.owner.id === userId), // filter only for playlists that belong to userId
      }))
      .catch(throwError);

    const numPlaylists = firstSlice.total;

    let playlists = firstSlice.items.map((playlist) => playlist.id);
    for (let i = 50; i < numPlaylists; i += 50) {
      const playlistSlice = await this.api
        .getUserPlaylists(userId, { offset: i, limit: 50 })
        .then(handleRateLimitedError)
        .then(({ body }) =>
          body.items
            .filter((playlist) => playlist.owner.id === userId) // filter only for playlists that belong to userId
            .map((playlist) => playlist.id),
        )
        .catch(throwError);

      playlists = playlists.concat(playlistSlice);
    }

    return playlists;
  };

  public getPlaylistWithTracks = async (
    playlistId: string,
  ): Promise<SpotifyPlaylist> => {
    const playlistObject = await this.api
      .getPlaylist(playlistId)
      .then(handleRateLimitedError)
      .then(({ body }) => body)
      .catch(throwError);

    const numTracks = playlistObject.tracks.total;

    let tracks: SpotifyTrack[] = [];
    for (let i = 0; i < numTracks; i += 50) {
      const playlistSlice = await this.api
        .getPlaylistTracks(playlistId, { offset: i, limit: 50 })
        .then(handleRateLimitedError)
        .then(({ body }) => body.items)
        .catch(throwError);

      tracks = tracks.concat(playlistSlice.map((track) => trimTrack(track)));
    }

    return {
      ...playlistObject,
      tracks,
    };
  };
}

export const getSpotify = (): SpotifyInstance => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = new SpotifyInstance();
    } else {
      if (!global.spotify) {
        global.spotify = new SpotifyInstance();
      }

      spotify = global.spotify;
    }
  }

  return spotify;
};
