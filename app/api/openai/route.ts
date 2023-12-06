// app/api/openai/route.ts

import { summarizeBookChapterWithOpenAI } from "@/app/components/GPT4BookSummary";

export const runtime = 'edge';

export async function POST(req: Request) {
  // Directly access the parsed body
  const { books } = await req.json();

  if (!books || books.length === 0) {
    return new Response(JSON.stringify({ error: "Books are required." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log("Received books for summarization:", books); // Log received books

  const summarizedBooks = [];
  for (const book of books) {
    try {
      console.log("Processing book:", book); // Log each book before processing
      const summary = await summarizeBookChapterWithOpenAI(book.title, book.authors, book.publishedDate);
      console.log("Received summary for book:", book.title, "summary:", summary); // Log after receiving summary

      summarizedBooks.push({
          title: book.title,
          authors: book.authors,
          summarizedText: summary
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error summarizing book:", book.title, errorMessage); // Log errors
      summarizedBooks.push({
          title: book.title,
          authors: book.authors,
          summarizedText: `Failed to summarize this book: ${errorMessage}`
      });
    }
  }

  return new Response(JSON.stringify({ summarizedBooks }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
