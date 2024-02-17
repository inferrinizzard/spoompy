'use client';

import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

import { useAppSelector } from '@/redux/client';
import { selectAuthStatus } from '@/redux/slices/userSlice';
import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

import BrowseMain from './main';

const Browse: React.FC = () => {
  const isAuthed = useAppSelector(selectAuthStatus);
  const isServer = typeof window === 'undefined';

  if (!isServer && !isAuthed) {
    console.info('[Nav] Redirecting from Browse back to Home');
    redirect('/', RedirectType.replace);
  }

  return (
    <main>
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </main>
  );
};

export default Browse;
