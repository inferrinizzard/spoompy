import SpotifyWebApi from 'spotify-web-api-js';
// docs: https://github.com/JMPerez/spotify-web-api-js
// Spotify API: https://developer.spotify.com/documentation/web-api/

export const hostname = 'http://localhost:3000';

export class Storage {
	static readonly stateName = 'spoompy-state';
	static readonly accessTokenName = 'spoompy-access_token';

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
	client_id: string;
	state: string;
	access_token!: string;

	constructor(client_id: string) {
		super();
		this.client_id = client_id;
		this.state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		if (+new Date() - Storage.stateTime > 1000 * 60 * 60) Storage.removeState();
		if (!Storage.state) Storage.assignState(this.state);
		if (Storage.accessToken) {
			Storage.removeState();
			// greater than 1 hr = expired
			if (+new Date() - Storage.accessTokenTime > 1000 * 60 * 60) {
				Storage.removeToken();
				return;
			}
			this.access_token = Storage.accessToken ?? '';
			this.setAccessToken(this.access_token);
		}
	}

	login = () => {
		const params = new URLSearchParams({
			client_id: this.client_id,
			response_type: 'token',
			redirect_uri: hostname,
			state: this.state,
			scope: [
				'user-read-recently-played',
				'playlist-read-private',
				'playlist-read-collaborative',
				'user-library-read',
			].join(' '),
		});

		const auth_url = `https://accounts.spotify.com/authorize?${params.toString()}`;
		window.location.replace(auth_url);
	};
}

type Class = { [key: string]: any };
const wrap =
	<T extends Class, Func extends (...args: any[]) => any>(_class: T, fn: Func) =>
	(...args: Parameters<Func>): ReturnType<Func> | Promise<ReturnType<Func>> | void => {
		try {
			const res = fn.apply(_class, args); // needs `this` reference
			Promise.resolve(res).then(
				null,
				err => (
					console.log('err', err.status, err),
					err.status === 401 && (Storage.removeState(), Storage.removeToken())
				)
			);
			return res;
		} catch (e) {
			console.log(e);
		}
	};

export function wrapObj<T extends Class>(_class: T, blacklist = ['login']): T {
	for (let fn in _class) {
		let member = _class[fn];
		if (typeof member === 'function' && !blacklist.includes(member))
			Object.defineProperty(_class, fn, {
				...Object.getOwnPropertyDescriptor(_class, fn),
				value: wrap(_class, member),
			});
	}
	return _class;
}

export default Spotify;
