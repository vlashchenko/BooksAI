// src/app/store/bookSlice.ts

// src/app/store/bookSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GoogleBookVolume } from '@/app/components/types';
import { filterAndDeduplicateBooks } from '@/app/components/filterBooks';

const cache = new Map<string, GoogleBookVolume[]>();

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: string, { rejectWithValue }) => {
    console.log(`Fetching books for query: ${query}`);
    const BACKEND_API_ENDPOINT = `https://my-backend-git-cors2-vlashchenkos-projects.vercel.app/books_list/list?q=${encodeURIComponent(query)}`;

    if (cache.has(query)) {
      console.log('Using cached data');
      const cachedData = cache.get(query);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await axios.get(BACKEND_API_ENDPOINT);
      const fetchedBooks: GoogleBookVolume[] = response.data.books;

      const filteredBooks = filterAndDeduplicateBooks(fetchedBooks, query);
      cache.set(query, filteredBooks);
      return filteredBooks;
    } catch (error) {
      console.error('API call failed:', error);
      return rejectWithValue('Failed to fetch books');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    items: [] as GoogleBookVolume[],
    selectedBook: null as GoogleBookVolume | null,
    bookDetails: [] as GoogleBookVolume[],
    queryContext: "",
    loading: false,
    error: null as string | null,
  },
  reducers: {
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    setBookDetails: (state, action) => {
      const updatedBook = action.payload;
      state.bookDetails = state.bookDetails.map((book) =>
        book.industryIdentifier?.identifier === updatedBook.industryIdentifier.identifier ? updatedBook : book
      );
      if (state.selectedBook && state.selectedBook.industryIdentifier?.identifier === updatedBook.industryIdentifier.identifier) {
        state.selectedBook = updatedBook;
      }
    },
    setQueryContext: (state, action) => {
      state.queryContext = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as GoogleBookVolume[];
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectBook, setBookDetails, setQueryContext } = booksSlice.actions;
export default booksSlice.reducer;