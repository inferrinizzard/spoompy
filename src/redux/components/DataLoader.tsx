'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  selectAuthStatus,
  selectUserPlaylists,
} from '@/redux/slices/userSlice';
import { getPlaylists } from '@/redux/actions/getPlaylists';

export const DataLoader: React.FC = () => {
  const loaded = useRef(false);

  const isAuthed = useSelector(selectAuthStatus);
  const playlists = useSelector(selectUserPlaylists);

  useEffect(() => {
    if (!isAuthed || playlists.length <= 0) {
      return;
    }

    if (!loaded.current) {
      console.log('loading playlists');
      getPlaylists(playlists.slice(0, 10));

      loaded.current = true;
    }
  }, [isAuthed, playlists]);

  return null;
};

export default DataLoader;
