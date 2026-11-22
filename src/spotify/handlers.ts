/* eslint-disable no-case-declarations */

export class RateLimitedError extends Error {
	public retryAfter: number;

	public constructor(
		message: ConstructorParameters<typeof Error>[0],
		retryAfter: number,
		options?: ConstructorParameters<typeof Error>[1],
	) {
		super(message, options);
		this.retryAfter = retryAfter;
	}
}

export const handleRateLimitedError = async (
	res: Response,
): Promise<Response> => {
	switch (res.status) {
		case 401:
			throw new Error(
				"Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.",
			);
		case 403:
			throw new Error(
				`Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here. Body: ${await res.text()}`,
			);
		case 429:
			const retryAfter = Number.parseInt(res.headers.get("Retry-After") ?? "0");
			throw new RateLimitedError(
				"The app has exceeded its rate limits.",
				retryAfter,
			);
		default:
			if (!res.status.toString().startsWith("20")) {
				throw new Error(
					`Unrecognised res code: ${res.status} - ${
						res.statusText
					}. Body: ${await res.text()}`,
				);
			}
	}

	return res;
};
