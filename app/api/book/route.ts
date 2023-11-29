
import { fetchBooksFromLibrary } from '@/app/components/fetchBooks';
import { getBookById } from '@/app/components/bookCache';  // Import from the new cache file

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Invalid query parameter provided.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const books = await fetchBooksFromLibrary(query);
    return new Response(JSON.stringify(books), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[GET] Error occurred:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "An error occurred while fetching books." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

