'use client';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

import BrowseMain from './main';

const Browse: React.FC = () => {
  return (
    <main>
      <Navbar />
      <BrowseMain />
      <ReturnButton />
    </main>
  );
};

export default Browse;
