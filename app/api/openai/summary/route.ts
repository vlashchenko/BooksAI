// app/api/openai/route.ts

import { summarizeBookChapterWithOpenAI } from "./GPT4BookSummary";

export const runtime = "edge";

export async function POST(req: Request) {
  const requestBody = await req.json();
  const books = requestBody.books;

  // Check if 'books' is an array and not empty
  if (!Array.isArray(books) || books.length === 0) {
    return new Response(JSON.stringify({ error: "Books are required and must be an array." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Received books for summarization:", books);

  try {
    // Process each book in the array and summarize
    const summaries = await Promise.all(books.map(book =>
      summarizeBookChapterWithOpenAI(book.title, book.authors.join(", "), book.publishedDate)
    ));

    console.log("Received summaries for books:", summaries);

    return new Response(JSON.stringify({ summaries }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ 
      error: `Failed to summarize the books: ${errorMessage}`,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
