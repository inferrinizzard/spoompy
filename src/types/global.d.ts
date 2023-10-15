import { type SpotifyInstance } from '@/spotify';
import { type ClientSpotifyInstance } from '@/spotify/client';

export declare global {
  var spotify: ClientSpotifyInstance | SpotifyInstance;
}
