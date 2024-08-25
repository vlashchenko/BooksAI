import { GoogleBookVolume, GoogleBooksAPIItem } from "@/app/components/types";

export const filterAndDeduplicateBooks = (apiItems: GoogleBooksAPIItem[], query: string): GoogleBookVolume[] => {
  const inputValue = query.toLowerCase();

  // Transform the API response items into your application's GoogleBookVolume type
  const books = apiItems.map((item): GoogleBookVolume => ({
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    publishedDate: item.volumeInfo.publishedDate,
    description: item.volumeInfo.description,
    industryIdentifier: item.volumeInfo.industryIdentifiers?.[0],
    pageCount: item.volumeInfo.pageCount,
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    categories: item.volumeInfo.categories,
    id: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
  }));

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(inputValue);
    const authorMatch = Array.isArray(book.authors) && book.authors.some((author) => author.toLowerCase().includes(inputValue));
    return titleMatch || authorMatch;
  });

  const uniqueIdentifiers = new Set(filteredBooks.map((b) => b.industryIdentifier?.identifier));

  const deduplicatedBooks = Array.from(uniqueIdentifiers).map((id) => {
    return filteredBooks.find((b) => b.industryIdentifier?.identifier === id);
  }).filter((book): book is GoogleBookVolume => book !== undefined);

  console.log(`[filterAndDeduplicateBooks] Final list of deduplicated books:`, deduplicatedBooks);
  
  return deduplicatedBooks;
};