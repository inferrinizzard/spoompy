import { type ServerSpotifyInstance } from '@/spotify';
import { type ClientSpotifyInstance } from '@/spotify/client';

export declare global {
  var spotify: ClientSpotifyInstance | ServerSpotifyInstance;
  var serverSpotify: ServerSpotifyInstance;
}
