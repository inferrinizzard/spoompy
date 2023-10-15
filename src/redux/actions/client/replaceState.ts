import { createAction } from '@reduxjs/toolkit';

import { type AppState } from '../../store';

export const replaceState = createAction<AppState>('REPLACE_STATE');
