import SpotifyWebApi from 'spotify-web-api-js';
// docs: https://github.com/JMPerez/spotify-web-api-js
// Spotify API: https://developer.spotify.com/documentation/web-api/

import { ClassFunction, wrapClassFunctions } from './classWrapper';

export const hostname = 'http://localhost:3000';

export class Storage {
	static readonly stateName = 'spoompy-state';
	static readonly accessTokenName = 'spoompy-accessToken';
	static readonly redirectName = 'spoompy-redirect';
	static readonly restoreName = 'spoompy-restore';

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

	static storeItem = (name: string, item: string) => sessionStorage.setItem(name, item);
	static getItem = (name: string) => sessionStorage.getItem(name);
	static removeItem = (name: string) => sessionStorage.removeItem(name);
}

class Spotify extends SpotifyWebApi {
	clientId: string;
	state: string;
	accessToken?: string;
	connected = false;
	refreshTimer?: ReturnType<typeof setTimeout>;

	constructor(clientId: string) {
		super();

		const generateStateHash = () =>
			[...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		this.clientId = clientId;
		this.state = generateStateHash();

		if (+new Date() - Storage.stateTime > 1000 * 60 * 60) Storage.removeState();
		if (!Storage.state) Storage.assignState(this.state);
		if (Storage.accessToken) {
			Storage.removeState();

			// greater than 1 hr = expired
			const tokenExpiryTime = +Storage.accessTokenTime + 60 * 60 * 1000;
			if (+new Date() > tokenExpiryTime) {
				Storage.removeToken();
				this.connected = false;
				return;
			}

			this.accessToken = Storage.accessToken;
			this.setAccessToken(this.accessToken);
			this.connected = true;
			// console.log('Connected:', this.connected);

			this.refreshTimer = setTimeout(() => {
				Storage.storeItem(Storage.restoreName, document.location.href);
				this.reset();

				this.state = generateStateHash();
				Storage.assignState(this.state);
				this.login(Storage.getItem(Storage.redirectName) ?? hostname, this.state);
				// alert('Your access token has expired, please refresh.');
			}, tokenExpiryTime - +new Date());
		}
	}

	login = (url = hostname, state = this.state) => {
		Storage.storeItem(Storage.redirectName, url);
		const params = new URLSearchParams({
			client_id: this.clientId,
			response_type: 'token',
			redirect_uri: url,
			state,
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

	reset = () => {
		Storage.removeToken();
		Storage.removeState();
		this.refreshTimer = undefined;
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
