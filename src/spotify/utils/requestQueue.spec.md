# Request Queue

### Rate Limiting

Spotify will impose a rate limit and throttle requests whenever a certain threshold within 30 seconds is exceeded.<br/>
The documentation does not provide a hard number as the limit is subject to change but testing has shown around ~180 requests per minute to be a benchmark.

When throttled, requests will return with a 429 error status code, as well as a Retry-After response header, denoting the time in seconds until the limit is refreshed.

### Get Playlists Cold Start

When fetching the user's playlist data for the first time, all requests must be made as there is no local cache to pull from.<br/>
This queued requests will be sent out in a batches of 30 calls at a time, not exceeding a rate of 30 calls / second.<br/>
In order to minimise rate limiting and decrease user latency, these requests will be prioritised in a queue that will async update the Redux store with each completed request.

The initial request first enqueues the `getPlaylist` call for each playlist id, before then enqueuing any successive `getPlaylistTracks` calls if the playlist has > 100 tracks.

Each batch returned by the Request Queue will contain:
- `next`: a link promise that will allow the awaiting of successive batch calls, or `null` if the queue is empty.
- `data`: the requested data of the api calls


In each batch, a timer is also included with a miniumum interval between batches to prevent making too many calls.
For each failed request in the batch, if the error is retry-able, the request is re-enqueued and allowed to run again.

If the rate limit is hit at any point during these batch requests, all successive failed requests in the batched are re-enqueud and the queue system will wait until the returned `Retry-After` value has passed until making any new requests.
