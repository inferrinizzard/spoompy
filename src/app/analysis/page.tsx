'use client';

import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

import AnalysisMain from './main';

const Analysis: React.FC = () => {
  return (
    <main>
      <Navbar />
      <AnalysisMain />
      <ReturnButton />
    </main>
  );
};

export default Analysis;
