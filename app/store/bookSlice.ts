import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GoogleBookVolume } from '@/app/components/types';
import { filterAndDeduplicateBooks } from '@/app/components/filterBooks';

// Cache mechanism (if needed)
const cache = new Map<string, GoogleBookVolume[]>();

// Thunk to fetch books based on a query
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: string, { rejectWithValue }) => {
    const BACKEND_API_ENDPOINT = `https://my-backend-git-cors2-vlashchenkos-projects.vercel.app/books_list/list?q=${encodeURIComponent(query)}`;

    if (cache.has(query)) {
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
      return rejectWithValue('Failed to fetch books');
    }
  }
);

// Thunk to fetch AI-generated summary for a book
export const fetchAiSummary = createAsyncThunk(
  'books/fetchAiSummary',
  async ({ bookDetails }: { bookDetails: GoogleBookVolume }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/summary`, {
        books: [bookDetails],
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
        }
      });

      return response.data.summaries[0].summary;
    } catch (error) {
      return rejectWithValue('Failed to fetch AI summary');
    }
  }
);

// Thunk to fetch AI-generated context based on a query
export const fetchAiContext = createAsyncThunk(
  'books/fetchAiContext',
  async ({ bookDetails, query }: { bookDetails: GoogleBookVolume, query: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/context`, {
        bookDetails: [bookDetails],  // Ensure bookDetails is an array
        query,
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
        }
      });

      return { query, context: response.data.context };
    } catch (error) {
      return rejectWithValue('Failed to fetch AI context');
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
    contextResponses: {} as Record<string, string>,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAiSummary.fulfilled, (state, action) => {
        if (state.selectedBook) {
          state.selectedBook.summary = action.payload;
        }
      })
      .addCase(fetchAiContext.fulfilled, (state, action) => {
        const { query, context } = action.payload;
        // Always create a new object for contextResponses to ensure immutability
        state.contextResponses = {
          ...state.contextResponses,
          [query]: context,
        };
      });
  },
});

export const { selectBook, setBookDetails, setQueryContext } = booksSlice.actions;
export default booksSlice.reducer;