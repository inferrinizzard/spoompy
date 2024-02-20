'use client';

import React, { useEffect } from 'react';

import { Spacer, Text } from '@/styles/primitives';
import HomeLink from '@/components/HomeLink';
import AuthMain from '@/components/auth/AuthMain';
import { useAppDispatch, useAppSelector } from '@/redux/client';
import {
  selectAuthStatus,
  selectUserDetails,
  setUserDetails,
} from '@/redux/slices/userSlice';

import styles from '../page.module.css';

export interface LandingProps {}

const LandingMain: React.FC<LandingProps> = () => {
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectAuthStatus);
  const userDetails = useAppSelector(selectUserDetails);

  useEffect(() => {
    if (userDetails && !isAuthed) {
      dispatch(setUserDetails(undefined));
    }
  }, [userDetails, isAuthed, dispatch]);

  return (
    <main className={styles.main}>
      <Text as="h1" fontSize={48}>
        {'Spotify Data Visualizer'}
      </Text>
      <Spacer height="2rem" />
      <HomeLink disabled={!isAuthed} href="/browse" text="Browse Library" />
      <HomeLink disabled={!isAuthed} href="/analysis" text="Data Analysis" />
      <HomeLink disabled={!isAuthed} href="/archive" text="Archive Playlists" />

      <AuthMain />

      {userDetails && (
        <>
          <h3>{`Logged in as: ${userDetails.display_name}`}</h3>
          <h3>{`With user id: ${userDetails.id}`}</h3>
        </>
      )}
    </main>
  );
};

export default LandingMain;
