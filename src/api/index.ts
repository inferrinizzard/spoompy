import { readFileSync, readdirSync } from 'fs';

export const getPlaylists = () => {
  const basePath = 'archive/2023-03-22/redux';

  const files = readdirSync(basePath);
  return files.map(file => JSON.parse(readFileSync(basePath + '/' + file, 'utf-8')));
};
