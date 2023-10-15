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

export const buildTrackFields = (): string => {
  const fields = [
    'name',
    'id',
    'popularity',
    'type',
    `artists(${buildArtistFields()})`, // get nested artists fields
    `album(${buildAlbumFields()})`, // get nested album fields
  ];

  return fields.join(',');
};

export const buildTrackItemFields = (): string => {
  const fields = ['added_at', 'added_by', `track(${buildTrackFields()})`];

  return fields.join(',');
};

export const buildPlaylistFields = (nested: boolean = false): string => {
  let fields = [
    'collaborative',
    'description',
    'id',
    'images',
    'name',
    'owner',
    'public',
    'snapshot_id',
  ];

  if (nested) {
    const nestedFields = [
      `tracks.items(${buildTrackItemFields()})`, // get nested track item fields
      `owner(id,display_name)`, // replace owner field
    ];

    fields.push(...nestedFields);
  }

  return fields.join(',');
};
