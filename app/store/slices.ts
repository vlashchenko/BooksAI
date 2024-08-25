// src/store/slices.ts

import { booksSlice } from './booksSlice';
import { authSlice } from './authSlice';

export const { setBooks, selectBook, setBookDetails, setQueryContext } = booksSlice.actions;
export const { setJwtToken } = authSlice.actions;
export const booksReducer = booksSlice.reducer;
export const authReducer = authSlice.reducer;