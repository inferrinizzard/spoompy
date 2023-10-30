import { createAction } from '@reduxjs/toolkit';

import { type AppState } from '../../store';

export const preloadState = createAction<AppState>('PRELOAD_STATE');
