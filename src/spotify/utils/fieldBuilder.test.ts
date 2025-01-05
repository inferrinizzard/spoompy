import {
	buildAlbumFields,
	buildArtistFields,
	buildPlaylistFields,
	buildTrackFields,
	buildTrackItemFields,
} from "./fieldBuilder";

describe("fieldBuilder", () => {
	describe("buildArtistFields", () => {
		it("builds artists fields", () => {
			const artistFields = buildArtistFields();

			expect(artistFields).toBe("id,name");
		});

		it("builds artists fields with extended fields", () => {
			const artistFields = buildArtistFields(false);

			expect(artistFields).toBe("id,name,followers,genres,popularity,images");
		});
	});

	describe("buildAlbumFields", () => {
		it("builds album fields", () => {
			const albumFields = buildAlbumFields();

			expect(albumFields).toBe("id,name,images");
		});

		it("builds album fields with extended fields", () => {
			const albumFields = buildAlbumFields(false);

			expect(albumFields).toBe("id,name,images,genres,popularity");
		});
	});

	describe("buildTrackFields", () => {
		it("builds track fields", () => {
			const trackFields = buildTrackFields();

			expect(trackFields).toBe(
				`name,id,popularity,type,artists(${buildArtistFields()}),album(${buildAlbumFields()})`,
			);
		});

		it("builds track items fields", () => {
			const trackFields = buildTrackItemFields();

			expect(trackFields).toBe(
				`added_at,added_by,track(name,id,popularity,type,artists(${buildArtistFields()}),album(${buildAlbumFields()}))`,
			);
		});
	});

	describe("buildPlaylistFields", () => {
		it("builds playlist fields", () => {
			const playlistFields = buildPlaylistFields();

			expect(playlistFields).toBe(
				"collaborative,description,id,images,name,owner,public,snapshot_id",
			);
		});

		it("builds playlist items fields with nested fields", () => {
			const playlistFields = buildPlaylistFields(true);

			expect(playlistFields).toBe(
				`collaborative,description,id,images,name,owner,public,snapshot_id,tracks.items(${buildTrackItemFields()}),owner(id,display_name)`,
			);
		});
	});
});
