// app/store/bookThunk.ts
"use client"
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleBookVolume, GoogleBooksAPIItem } from '@/app/components/types';
import { filterAndDeduplicateBooks } from '@/app/components/filterBooks';
import { RootState } from '@/app/store/store';
import { setJwtToken } from '@/app/store/slices';
import { getJwtToken } from '@/app/utils/authUtils'; // Import from new auth utility
import { postWithAuth } from '@/app/utils/apiUtils'; // Import from new API utility
import axios from 'axios'

// Cache mechanism (if needed)
const cache = new Map<string, GoogleBookVolume[]>();

const convertToGoogleBookVolume = (item: GoogleBooksAPIItem): GoogleBookVolume => ({
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors,
  publishedDate: item.volumeInfo.publishedDate,
  description: item.volumeInfo.description,
  industryIdentifier: item.volumeInfo.industryIdentifiers?.[0],
  categories: item.volumeInfo.categories,
  pageCount: item.volumeInfo.pageCount,
  thumbnail: item.volumeInfo.imageLinks?.thumbnail,
  id: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
});

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: string, { rejectWithValue }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const BACKEND_API_ENDPOINT = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

    if (cache.has(query)) {
      return cache.get(query);
    }

    try {
      const response = await axios.get(BACKEND_API_ENDPOINT);
      const fetchedBooks = response.data.items.map(convertToGoogleBookVolume);
      const filteredBooks = filterAndDeduplicateBooks(response.data.items, query);
      cache.set(query, filteredBooks);
      return filteredBooks;
    } catch (error) {
      return rejectWithValue('Failed to fetch books');
    }
  }
);

export const fetchAiSummary = createAsyncThunk(
  'books/fetchAiSummary',
  async ({ bookDetails }: { bookDetails: GoogleBookVolume }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    let jwtToken = state.auth.jwtToken;

    if (!jwtToken) {
      jwtToken = await getJwtToken();
      if (jwtToken) {
        dispatch(setJwtToken(jwtToken));
      } else {
        return rejectWithValue('JWT token is missing');
      }
    }

    const payload = { books: [{ ...bookDetails, authors: bookDetails.authors || [] }] };
    try {
      const response = await postWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/summary`, payload, jwtToken);
      return response.data.summaries[0].summary;
    } catch (error) {
      return rejectWithValue('Failed to fetch AI summary');
    }
  }
);

export const fetchAiContext = createAsyncThunk(
  'books/fetchAiContext',
  async ({ bookDetails, query }: { bookDetails: GoogleBookVolume, query: string }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    let jwtToken = state.auth.jwtToken;

    if (!jwtToken) {
      jwtToken = await getJwtToken();
      if (jwtToken) {
        dispatch(setJwtToken(jwtToken));
      } else {
        return rejectWithValue('JWT token is missing');
      }
    }

    const payload = {
      bookDetails: [{ ...bookDetails, authors: bookDetails.authors || [] }],
      query,
    };

    try {
      const response = await postWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/context`, payload, jwtToken);
      return { query, context: response.data.context };
    } catch (error) {
      return rejectWithValue('Failed to fetch AI context');
    }
  }
);