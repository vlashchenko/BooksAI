export type GoogleBookVolume = {
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  context?: Record<string, string>;
  industryIdentifier?: {
    type: string;
    identifier: string;
  };
  pageCount?: number;
  thumbnail?: string;
  summary?: string;
  categories?: string[];
  id?: string;
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
    categories?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
    };
  };
};

export interface JWTToken {
<<<<<<< HEAD
    accessToken: string;
    [key: string]: unknown;
  }
  
  export interface User {
    access_token: string;
    email: string;
    username: string;
  }
  
  export interface Session {
    accessToken?: string;
    user?: {
      email: string;
      name: string;
    };
  }
=======
  accessToken: string;
  [key: string]: unknown;
}

export interface User {
  access_token: string;
  email: string;
  username: string;
}

export interface Session {
  accessToken?: string;
  user?: {
    email: string;
    name: string;
  };
}
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
