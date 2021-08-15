import SpotifyWebApi from 'spotify-web-api-js';
// docs: https://github.com/JMPerez/spotify-web-api-js
// Spotify API: https://developer.spotify.com/documentation/web-api/

import { ClassFunction, wrapClassFunctions } from './classWrapper';

export const hostname = 'http://localhost:3000';

export class Storage {
	static readonly stateName = 'spoompy-state';
	static readonly accessTokenName = 'spoompy-accessToken';

	static get state() {
		return sessionStorage.getItem(Storage.stateName);
	}
	static get accessToken() {
		return sessionStorage.getItem(Storage.accessTokenName);
	}
	static get stateTime() {
		return +(sessionStorage.getItem(Storage.stateName + '=time') ?? 0);
	}
	static get accessTokenTime() {
		return +(sessionStorage.getItem(Storage.accessTokenName + '=time') ?? 0);
	}

	static assignState = (state: string) => (
		sessionStorage.setItem(Storage.stateName, state),
		sessionStorage.setItem(Storage.stateName + '=time', +new Date() + '')
	);

	static assignToken = (token: string) => (
		sessionStorage.setItem(Storage.accessTokenName, token),
		sessionStorage.setItem(Storage.accessTokenName + '=time', +new Date() + '')
	);

	static removeState = () => (
		sessionStorage.removeItem(Storage.stateName),
		sessionStorage.removeItem(Storage.stateName + '=time')
	);

	static removeToken = () => (
		sessionStorage.removeItem(Storage.accessTokenName),
		sessionStorage.removeItem(Storage.accessTokenName + '=time')
	);
}

class Spotify extends SpotifyWebApi {
	clientId: string;
	state: string;
	accessToken!: string;
	connected = false;

	constructor(clientId: string) {
		super();
		this.clientId = clientId;
		this.state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		if (+new Date() - Storage.stateTime > 1000 * 60 * 60) Storage.removeState();
		if (!Storage.state) Storage.assignState(this.state);
		if (Storage.accessToken) {
			Storage.removeState();
			// greater than 1 hr = expired
			if (+new Date() - Storage.accessTokenTime > 1000 * 60 * 60) {
				Storage.removeToken();
				this.connected = false;
				return;
			}
			this.accessToken = Storage.accessToken ?? '';
			this.setAccessToken(this.accessToken);
			this.connected = true;
			console.log('Connected:', this.connected);
			setTimeout(() => alert('Your access token has expired, please refresh.'), 1000 * 60 * 60);
		}
	}

	login = (url = hostname) => {
		const params = new URLSearchParams({
			client_id: this.clientId,
			response_type: 'token',
			redirect_uri: url,
			state: this.state,
			scope: [
				'user-read-recently-played',
				'playlist-read-private',
				'playlist-read-collaborative',
				'user-library-read',
				'user-top-read',
			].join(' '),
		});

		const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
		window.location.replace(authUrl);
	};
}

const checkForExpiredToken = (res: ReturnType<ClassFunction<Spotify>>) => {
	Promise.resolve(res).then(
		null,
		err => (
			console.log('err', err.status, err),
			err.status === 401 && (Storage.removeState(), Storage.removeToken())
		)
	);
};

const wrapSpotify = (clientId: string) =>
	wrapClassFunctions(new Spotify(clientId), ['login'], checkForExpiredToken);
export default wrapSpotify;
