// src/components/types.ts

export type GoogleBookVolume = {
    title?: string,
    authors?: string[],
    publishedDate?: string,
    description?: string,
    context?:string,
    industryIdentifier?: {
        type: string,
        identifier: string
    },
    pageCount?: number,
    thumbnail?: string,
    summary?: string,
};

export type GoogleBooksAPIItem = {
    volumeInfo: {
        title: string;
        authors: string[];
        publishedDate?: string;
        description?: string;
        industryIdentifiers?: Array<{
            type: string;
            identifier: string;
        }>;
        pageCount?: number;
        imageLinks?: {
            thumbnail: string;
        };
    };
};
  

// Define the type for your context, including functions and state
export type BookContextType = {
    books: GoogleBookVolume[];
    setBooks: (books: GoogleBookVolume[]) => void;
    // add other states and functions as needed
  };