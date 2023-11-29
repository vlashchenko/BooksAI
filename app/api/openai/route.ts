// pages/api/bookGPTAPI.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { summarizeBookChapterWithOpenAI } from "@/app/components/GPT4BookSummary";

const MAX_BOOKS = 5;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "OpenAI API key not set!" });
    return;
  }

  // Directly access the parsed body
  const { books } = req.body;

  if (!books || books.length === 0) {
    return new Response(JSON.stringify({ error: "Books are required." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (books.length > MAX_BOOKS) {
    return new Response(JSON.stringify({ error: `Cannot summarize more than ${MAX_BOOKS} books in one request.` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const summarizedBooks = [];
  for (let book of books) {
    try {
        const summary = await summarizeBookChapterWithOpenAI(book.title, book.authors, book.publishedDate);
        summarizedBooks.push({
            title: book.title,
            authors: book.authors,
            summarizedText: summary
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
