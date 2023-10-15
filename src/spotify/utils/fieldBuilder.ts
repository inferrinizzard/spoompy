export const buildArtistFields = (simplified: boolean = true): string => {
  const fields = ['id', 'name'];
  const extendedFields = ['followers', 'genres', 'popularity', 'images'];

  let outString = fields.join(',');
  if (!simplified) {
    outString += ',' + extendedFields.join(',');
  }

  return outString;
};

export const buildAlbumFields = (simplified: boolean = true): string => {
  const fields = ['id', 'name', 'images'];
  const extendedFields = ['genres', 'popularity'];

  let outString = fields.join(',');
  if (!simplified) {
    outString += ',' + extendedFields.join(',');
  }

  return outString;
};

export const buildTrackFields = (nested: boolean = false): string => {
  const fields = ['name', 'added_at', 'added_by', 'id', 'popularity', 'type'];

  let outString = fields.join(',');

  if (nested) {
    const nestedFields = {
      artists: `,artists(${buildArtistFields()})`,
      album: `,album(${buildAlbumFields()})`,
    };

    Object.entries(nestedFields).forEach(
      ([field, nestedString]) => (outString += nestedString),
    );
  }

  return outString;
};

export const buildPlaylistFields = (nested: boolean = false): string => {
  const fields = [
    'collaborative',
    'description',
    'id',
    'images',
    'name',
    'owner',
    'public',
    'snapshot_id',
  ];

  let outString = fields.join(',');

  if (nested) {
    const nestedFields = {
      tracks: `,tracks.items(added_at,added_by,track(${buildTrackFields(
        true,
      )}))`,
      owner: `,owner(id,display_name)`,
    };

    Object.entries(nestedFields).forEach(
      ([field, nestedString]) => (outString += nestedString),
    );
  }

  return outString;
};
