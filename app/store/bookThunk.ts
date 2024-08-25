import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GoogleBookVolume, GoogleBooksAPIItem } from '@/app/components/types';
import { filterAndDeduplicateBooks } from '@/app/components/filterBooks';
import { RootState } from '@/app/store/store';
import { getSession } from 'next-auth/react';  // Import getSession from next-auth
import { setJwtToken } from '@/app/store/slices'; // Import setJwtToken from your slices


// Cache mechanism (if needed)
const cache = new Map<string, GoogleBookVolume[]>();

// Function to convert GoogleBooksAPIItem to GoogleBookVolume
const convertToGoogleBookVolume = (item: GoogleBooksAPIItem): GoogleBookVolume => {
  return {
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    publishedDate: item.volumeInfo.publishedDate,
    description: item.volumeInfo.description,
    industryIdentifier: item.volumeInfo.industryIdentifiers?.[0], // Taking the first identifier as primary
    categories: item.volumeInfo.categories,
    pageCount: item.volumeInfo.pageCount,
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    id: item.volumeInfo.industryIdentifiers?.[0]?.identifier, // Adding id for consistency
  };
};

// Thunk to fetch books based on a query
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: string, { rejectWithValue }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const BACKEND_API_ENDPOINT = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

    console.log(`[fetchBooks] Sending request to: ${BACKEND_API_ENDPOINT}`);

    if (cache.has(query)) {
      const cachedData = cache.get(query);
      if (cachedData) {
        console.log(`[fetchBooks] Returning cached data for query: ${query}`);
        return cachedData;
      }
    }

    try {
      const response = await axios.get(BACKEND_API_ENDPOINT);
      console.log(`[fetchBooks] Response received from backend:`, response.data);

      // Convert GoogleBooksAPIItem[] to GoogleBookVolume[]
      const fetchedBooks: GoogleBookVolume[] = response.data.items.map((item: GoogleBooksAPIItem) =>
        convertToGoogleBookVolume(item)
      );
      console.log(`[fetchBooks] Fetched books before filtering:`, fetchedBooks);

      // Pass the original `GoogleBooksAPIItem[]` to `filterAndDeduplicateBooks`
      const filteredBooks = filterAndDeduplicateBooks(response.data.items, query);
      console.log(`[fetchBooks] Filtered books for query "${query}":`, filteredBooks);

      cache.set(query, filteredBooks);
      return filteredBooks;
    } catch (error) {
      console.error(`[fetchBooks] Failed to fetch books for query "${query}":`, error);
      return rejectWithValue('Failed to fetch books');
    }
  }
);

// Thunk to fetch AI-generated summary for a book
// Thunk to fetch AI-generated summary for a book
export const fetchAiSummary = createAsyncThunk(
  'books/fetchAiSummary',
  async ({ bookDetails }: { bookDetails: GoogleBookVolume }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    let jwtToken = state.auth.jwtToken;

    // If the JWT token is missing in Redux, retrieve it from the NextAuth session
    if (!jwtToken) {
      console.log(`[fetchAiSummary] JWT token is missing in Redux, fetching from session...`);
      const session = await getSession();
      if (session?.accessToken) {
        jwtToken = session.accessToken as string;
        dispatch(setJwtToken(jwtToken));  // Store the token back in Redux
        console.log(`[fetchAiSummary] Retrieved and stored JWT token from session: ${jwtToken}`);
      } else {
        console.error(`[fetchAiSummary] Failed to retrieve JWT token from session`);
        return rejectWithValue('JWT token is missing');
      }
    }

    // Ensure authors is an array, even if empty
    const payload = {
      books: [
        {
          ...bookDetails,
          authors: bookDetails.authors || [], // Make sure authors is an array
        },
      ],
    };
    
    console.log(`[fetchAiSummary] Sending request with payload:`, payload);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/summary`, payload, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      console.log(`[fetchAiSummary] Response received from AI summary endpoint:`, response.data);
      return response.data.summaries[0].summary;
    } catch (error) {
      console.error(`[fetchAiSummary] Failed to fetch AI summary:`, error);
      return rejectWithValue('Failed to fetch AI summary');
    }
  }
);

// Thunk to fetch AI-generated context based on a query
export const fetchAiContext = createAsyncThunk(
  'books/fetchAiContext',
  async ({ bookDetails, query }: { bookDetails: GoogleBookVolume, query: string }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    let jwtToken = state.auth.jwtToken;

    // If the JWT token is missing in Redux, retrieve it from the NextAuth session
    if (!jwtToken) {
      console.log(`[fetchAiContext] JWT token is missing in Redux, fetching from session...`);
      const session = await getSession();
      if (session?.accessToken) {
        jwtToken = session.accessToken as string;
        dispatch(setJwtToken(jwtToken));  // Store the token back in Redux
        console.log(`[fetchAiContext] Retrieved and stored JWT token from session: ${jwtToken}`);
      } else {
        console.error(`[fetchAiContext] Failed to retrieve JWT token from session`);
        return rejectWithValue('JWT token is missing');
      }
    }

    // Ensure authors is an array, even if empty
    const payload = {
      bookDetails: [
        {
          ...bookDetails,
          authors: bookDetails.authors || [], // Make sure authors is an array
        },
      ],
      query,
    };

    console.log(`[fetchAiContext] Sending request with payload:`, payload);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openai/context`, payload, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      console.log(`[fetchAiContext] Response received from AI context endpoint:`, response.data);
      return { query, context: response.data.context };
    } catch (error) {
      console.error(`[fetchAiContext] Failed to fetch AI context:`, error);
      return rejectWithValue('Failed to fetch AI context');
    }
  }
);