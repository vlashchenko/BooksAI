// src/utils/filterBooks.ts
import { GoogleBookVolume } from "@/app/components/types";

export const filterAndDeduplicateBooks = (books: GoogleBookVolume[], query: string): GoogleBookVolume[] => {
  const inputValue = query.toLowerCase();

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(inputValue);
    const authorMatch = Array.isArray(book.authors) && book.authors.some((author) => author.toLowerCase().includes(inputValue));
    return titleMatch || authorMatch;
  });

  const uniqueIdentifiers = new Set(filteredBooks.map((b) => b.industryIdentifier.identifier));

  const deduplicatedBooks = Array.from(uniqueIdentifiers).map((id) => {
    return filteredBooks.find((b) => b.industryIdentifier.identifier === id);
  }).filter((book): book is GoogleBookVolume => book !== undefined);

  return deduplicatedBooks;
};
