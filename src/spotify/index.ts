import {
  ConsoleLoggingErrorHandler,
  type SdkOptions,
} from '@spotify/web-api-ts-sdk';

import { SpotifyInstance } from './spotify';

const spotifySdkConfig: SdkOptions = {
  errorHandler: new ConsoleLoggingErrorHandler(),
};

let spotify: SpotifyInstance | null;

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

  return spotify as SpotifyInstance;
};

export const spotifyLogout = (): void => {
  spotify?.sdk.logOut();
  spotify = null;
  if (process.env.NODE_ENV !== 'production') {
    global.spotify = null as unknown as SpotifyInstance;
  }
};
