'use client';

import React, { useState } from 'react';

import TabularView from './TabularView';
import PlaylistView from './PlaylistView';

export interface DisplayProps {}

const BrowseMain: React.FC<DisplayProps> = () => {
  const [view, setView] = useState<'tabular' | 'playlist'>('tabular');

  return (
    <>
      <button
        onClick={() => {
          view === 'playlist' ? setView('tabular') : setView('playlist');
        }}
        type="button">
        {'Switch View'}
      </button>
      {view === 'playlist' && <PlaylistView />}
      {view === 'tabular' && <TabularView />}
    </>
  );
};

export default BrowseMain;
