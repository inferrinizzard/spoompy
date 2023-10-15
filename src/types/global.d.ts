import {
  type ClientSpotifyInstance,
  type ServerSpotifyInstance,
} from '@/spotify';

export declare global {
  var clientSpotify: ClientSpotifyInstance;
  var serverSpotify: ServerSpotifyInstance;
}
