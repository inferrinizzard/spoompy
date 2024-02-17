'use client';

import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

import { useAppSelector } from '@/redux/client';
import { selectAuthStatus } from '@/redux/slices/userSlice';
import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

import ArchiveMain from './main';

const Archive: React.FC = () => {
  const isAuthed = useAppSelector(selectAuthStatus);
  const isServer = typeof window === 'undefined';

  if (!isServer && !isAuthed) {
    console.info('[Nav] Redirecting from Archive back to Home');
    redirect('/', RedirectType.replace);
  }

  return (
    <main>
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </main>
  );
};

export default Archive;
