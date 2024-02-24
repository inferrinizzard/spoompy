'use client';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

import ArchiveMain from './main';

const Archive: React.FC = () => {
  return (
    <main>
      <Navbar />
      <ArchiveMain />
      <ReturnButton />
    </main>
  );
};

export default Archive;
