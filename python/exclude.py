import argparse
import os
import json


def get_playlist_or_folder_paths(basepath, name):
    path = os.path.join(basepath, name)

    if(os.path.exists(path) or os.path.exists(path + '.json')):
        if(os.path.isdir(path)):
            return [os.path.join(path, p) for p in os.listdir(path)]
        return [path + '.json']

    dirs = [d for d in os.listdir(basepath) if os.path.isdir(
        os.path.join(basepath, d))]
    if(len(dirs)):
        for d in dirs:
            outpath = get_playlist_or_folder_paths(
                os.path.join(basepath, d), name)
            if outpath:
                return outpath
        return None

    return None


def main(kwargs):
    basepath = os.path.join('archive', kwargs.date)
    source = get_playlist_or_folder_paths(basepath, kwargs.source)
    mask = get_playlist_or_folder_paths(basepath, kwargs.mask)

    if not source or not mask:
        raise argparse.ArgumentError(
            f'{"source" if not source else "mask"} does not exist')

    with open(source[0], 'r', encoding='utf8') as f:
        source_list = json.load(f)

    mask_map = {}
    for path in mask:
        with open(path, 'r', encoding='utf8') as f:
            mask_list = json.load(f)
            for track in mask_list:
                mask_map[track['id']] = track['id']
                mask_map[track['name']] = track['name']

    remaining = [
        track for track in source_list if not mask_map.get(track['id']) and not mask_map.get(track['name'])]
    print(remaining)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('date')
    parser.add_argument('source')
    parser.add_argument('mask')

    main(parser.parse_args())
