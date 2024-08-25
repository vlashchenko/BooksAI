// app/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { booksReducer, authReducer } from './slices';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,  // Add authReducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;