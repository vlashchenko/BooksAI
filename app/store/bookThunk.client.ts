// app/store/bookThunk.client.ts
"use client"

import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleBookVolume } from '@/app/components/types';
import { RootState } from '@/app/store/store';
import { setJwtToken } from '@/app/store/slices';
import { getJwtToken } from '@/app/utils/authUtils';
import { postWithAuth } from '@/app/utils/apiUtils';

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