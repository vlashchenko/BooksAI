// app/components/GPT4BookSummary.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ensure the OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key not set!");
  throw new Error("Error: API key not set.");
}

export const summarizeBookContextWithOpenAI = async (title: string, authors: string[], publishedDate: string, query: string) => {
  const authorsStr = authors.join(", ");
  console.log("Prompt for OpenAI:", title, authorsStr, publishedDate, query);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You will be provided with a book name, its authors, the publishedDate and a query regarding this book.
                    Your task is to define the book, and if you know its content - to generate an answer for the query regarding the book within a certain token number. 
                    You should generate the answer within the context of the book or its author. If the question is not relevant, answer like "Please provide relevance to the book".`
        },
        {
          role: "user",
          content: `Answer the question: ${query} regarding the Book: ${title} by ${authorsStr} published ${publishedDate}.`
        }
      ],
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || "Error: Failed to get a summarized response.";

  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Error summarizing the book with OpenAI.");
  }
};
