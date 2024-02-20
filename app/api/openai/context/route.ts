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

    const context = await Promise.all(
      bookDetails.map(book =>
        summarizeBookContextWithOpenAI(
          book.title, 
          book.authors, 
          book.publishedDate, 
          query
        ).catch(error => {
          console.error("Error summarizing book:", book.title, error.message);
          return { 
            title: book.title, 
            authors: book.authors.join(", "),
            contextAI: `Failed to summarize this book: ${error.message}` 
          };
        })
      )
    );

    return new Response(JSON.stringify(context), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Error processing request." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
