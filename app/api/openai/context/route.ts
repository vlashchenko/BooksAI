// app/api/openai/route.ts

import { summarizeBookContextWithOpenAI } from "./GPT4BookContext";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { bookDetails, query } = await req.json();
  
    if (!Array.isArray(bookDetails) || bookDetails.length === 0 || !query || query.length === 0) {
      return new Response(JSON.stringify({ error: "Books and query are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Received books for summarization:", bookDetails);

    const summaries = await Promise.all(
      bookDetails.map(book => 
        summarizeBookContextWithOpenAI(
          book.title, 
          book.authors, 
          book.publishedDate, 
          query
        ).catch(error => {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Error summarizing book:", book.title, errorMessage);
          return { 
            title: book.title, 
            authors: book.authors, 
            summarizedText: `Failed to summarize this book: ${errorMessage}` 
          };
        })
      )
    );

    return new Response(JSON.stringify(summaries), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error parsing request";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
