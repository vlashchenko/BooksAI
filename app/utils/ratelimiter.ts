// src/utils/rateLimiter.ts
// src/utils/rateLimiter.ts
import { fetchBooksFromLibrary } from '@/app/components/fetchBooks';

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // Minimum interval between requests in ms

export const rateLimitedFetch = async (query: string) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting, delaying request by ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
  return fetchBooksFromLibrary(query);
};