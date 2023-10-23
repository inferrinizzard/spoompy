# Entity Cache

### Playlists
When a getPlaylist request is received (PlaylistRef is passed as param), the Spotify Instance should first check the cache to see if a local copy of the data exists before making an API call.<br/>
The Instance first checks the cache using the `playlist.id`, returning the latest playlist `snapshotId` if it exists.

If the `snapshotId` matches the one from the incoming PlaylistRef, then the Instance proceeds to check if the PlaylistObject corresponding with that `snapshotId` exists in the cache.<br/>
If the `snapshotId` does not match the incoming PlaylistRef, this means that the cached `snapshotId` is outdated and the stored PlaylistObject should be removed.

If, after confirming that the `snapshotId` is not outdated _and_ that the PlaylistObject exists in the cache, the PlaylistObject can be returned directly without calling the API.<br/>
Else, if there exists no matching PlaylistObject in the cache, then the standard getPlaylist API call is made and the results are stored as such:
- the data of the PlaylistObject are stored under the `snapshotId`
- the `snapshotId` is stored under the `playlist.id` as a ref to the latest snapshot
