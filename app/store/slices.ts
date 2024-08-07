// src/store/slices.ts

import { createSlice } from '@reduxjs/toolkit';
import { GoogleBookVolume } from '@/app/components/types';

const initialBooksState = {
  items: [] as GoogleBookVolume[],
  selectedBook: null as GoogleBookVolume | null,
  bookDetails: [] as GoogleBookVolume[],
  queryContext: '' as string,
};

const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    setBooks: (state, action) => {
      state.items = action.payload;
    },
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    setBookDetails: (state, action) => {
      state.bookDetails = action.payload;
    },
    setQueryContext: (state, action) => {
      state.queryContext = action.payload;
    },
  },
});

export const { setBooks, selectBook, setBookDetails, setQueryContext } = booksSlice.actions;
export default booksSlice.reducer;