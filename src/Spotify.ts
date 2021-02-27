import SpotifyWebApi from 'spotify-web-api-js';

export const hostname = 'http://localhost:3000';
export const stateName = 'spoompy-state',
	accessTokenName = 'spoompy-access_token';

class Spotify extends SpotifyWebApi {
	client_id: string;
	state: string;
	access_token!: string;

	constructor(client_id: string) {
		super();
		this.client_id = client_id;
		this.state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		if (!sessionStorage.getItem(stateName)) sessionStorage.setItem(stateName, this.state); // add time for expiry / flush old
		if (sessionStorage.getItem(accessTokenName)) {
			sessionStorage.removeItem(stateName);
			this.access_token = sessionStorage.getItem(accessTokenName) ?? '';
			this.setAccessToken(this.access_token);
			this.getMe().then(
				() => {},
				({ status, responseText }) =>
					status === 401 &&
					responseText.includes('expired') &&
					((this.access_token = ''), sessionStorage.removeItem(accessTokenName))
			);
		}
	}

	login = () => {
		const params = new URLSearchParams({
			client_id: this.client_id,
			response_type: 'token',
			redirect_uri: hostname,
			state: this.state,
			scope: ['user-read-recently-played', 'playlist-read-private'].join(' '),
		});

		const auth_url = `https://accounts.spotify.com/authorize?${params.toString()}`;
		window.location.replace(auth_url);
	};
}

type Class = { [key: string]: any };
const wrap = <T extends Class, Func extends (...args: any[]) => any>(_class: T, fn: Func) => (
	...args: Parameters<Func>
): ReturnType<Func> | Promise<ReturnType<Func>> | void => {
	try {
		const res = fn.apply(_class, args); // needs this reference
		Promise.resolve(res).then(null, ({ status }) => console.log('err', status));
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
