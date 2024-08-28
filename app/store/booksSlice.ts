// src/store/booksSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { GoogleBookVolume } from "@/app/components/types";
import { fetchBooks, fetchAiSummary, fetchAiContext } from "./bookThunk.client";

const initialBooksState = {
  items: [] as GoogleBookVolume[],
  selectedBook: null as GoogleBookVolume | null,
  bookDetails: [] as GoogleBookVolume[],
  queryContext: "" as string,
  contextResponses: {} as Record<string, string>,
  loading: false,
  error: null as string | null,
};

export const booksSlice = createSlice({
  name: "books",
  initialState: initialBooksState,
  reducers: {
    setBooks: (state, action) => {
      state.items = action.payload;
    },
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
      state.contextResponses = {}; // Clear context responses when a new book is selected
    },
    setBookDetails: (state, action) => {
      const updatedBook = action.payload;
      state.bookDetails = state.bookDetails.map((book) =>
        book.industryIdentifier?.identifier ===
        updatedBook.industryIdentifier.identifier
          ? updatedBook
          : book
      );
      if (
        state.selectedBook &&
        state.selectedBook.industryIdentifier?.identifier ===
          updatedBook.industryIdentifier.identifier
      ) {
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
        state.contextResponses = {
          ...state.contextResponses,
          [query]: context,
        };
      });
  },
});

export const { setBooks, selectBook, setBookDetails, setQueryContext } =
  booksSlice.actions;
export default booksSlice.reducer;
