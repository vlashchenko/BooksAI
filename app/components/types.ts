// src/components/types.ts

export type Book = {
    query: string;
    title: string;
    author: string;
    bookUrl: string;
}

export type Library = {
    libraryId: string;
    libraryUrl: string;
}

export type GoogleBookVolume = {
    title: string,
    authors: string[],
    publishedDate?: string,
    description?: string,
    industryIdentifier: {
        type: string,
        identifier: string
    },
    pageCount?: number,
    thumbnail?: string
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

export type BookDropdownProps = {
    books?: GoogleBookVolume[];
    onInputChange: (value: string) => void;
    isLoading: boolean;
};
  
export type BookVolumesResponse = {
    kind: string;
    totalItems: number;
    items: GoogleBookVolume[];
};

// Define the type for your context, including functions and state
export type BookContextType = {
    books: GoogleBookVolume[];
    setBooks: (books: GoogleBookVolume[]) => void;
    // add other states and functions as needed
  };