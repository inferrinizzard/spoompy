import { type ClientSpotifyInstance } from '@/spotify/client';
import { type ServerSpotifyInstance } from '@/spotify/server';

export declare global {
  var clientSpotify: ClientSpotifyInstance;
  var serverSpotify: ServerSpotifyInstance;
}
