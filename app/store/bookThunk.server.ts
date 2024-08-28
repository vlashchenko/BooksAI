// app/store/bookThunk.server.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleBookVolume, GoogleBooksAPIItem } from '@/app/components/types';
import { filterAndDeduplicateBooks } from '@/app/components/filterBooks';
import axios from 'axios';

const cache = new Map<string, GoogleBookVolume[]>();

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
      const fetchedBooks = response.data.items.map((item: GoogleBooksAPIItem) => ({
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        industryIdentifier: item.volumeInfo.industryIdentifiers?.[0],
        categories: item.volumeInfo.categories,
        pageCount: item.volumeInfo.pageCount,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        id: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      }));
      const filteredBooks = filterAndDeduplicateBooks(response.data.items, query);
      cache.set(query, filteredBooks);
      return filteredBooks;
    } catch (error) {
      return rejectWithValue('Failed to fetch books');
    }
  }
);