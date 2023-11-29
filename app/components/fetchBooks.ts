// fetchBooks.ts

import axios from "axios";
import { GoogleBookVolume, GoogleBooksAPIItem } from "./types";
import { cacheBookById, getBookById } from './bookCache';  // Import from the new cache file

const API_KEY = process.env.API_KEY; // Assuming you have an API key

export const fetchBooksFromLibrary = async (query: string): Promise<GoogleBookVolume[]> => {
  const formattedQuery = `intitle:${encodeURIComponent(
    query
  )}+inauthor:${encodeURIComponent(query)}`;
  const GOOGLE_BOOKS_API_ENDPOINT = `https://www.googleapis.com/books/v1/volumes?q=${formattedQuery}*`;

  console.log("Attempting to fetch books for query:", query);

  try {
    const response = await axios.get(GOOGLE_BOOKS_API_ENDPOINT);
    console.log(
      "Successfully fetched data from Google Books API:",
      response.data
    );

    console.log("Full Object:", JSON.stringify(response.data, null, 2));
    const fetchedBooks: GoogleBookVolume[] = response.data.items
      ? response.data.items.map((item: GoogleBooksAPIItem) => ({
        
              title: item.volumeInfo.title || "Unknown title",
              authors: item.volumeInfo.authors || "Unknown author",
              publishedDate: item.volumeInfo.publishedDate || "No Date",
              description: item.volumeInfo.description || "No Description",
              industryIdentifier: {
                type: item.volumeInfo.industryIdentifiers
                  ? item.volumeInfo.industryIdentifiers[0].type
                  : "",
                identifier: item.volumeInfo.industryIdentifiers
                  ? item.volumeInfo.industryIdentifiers[0].identifier
                  : "",
              },
              pageCount: item.volumeInfo.pageCount,
              thumbnail: item.volumeInfo.imageLinks
                ? item.volumeInfo.imageLinks.thumbnail
                : undefined,
        }))
      : [];

    fetchedBooks.forEach(book => {
      if (book.industryIdentifier?.identifier) {
        cacheBookById(book.industryIdentifier.identifier, book);
      }
    });

    return fetchedBooks;
  } catch (error) {
    console.error(
      "Error fetching books:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};
