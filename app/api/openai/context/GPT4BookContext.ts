// app/components/GPT4BookSummary.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("API Key:", process.env.OPENAI_API_KEY);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export const summarizeBookContextWithOpenAI = async (title: string, authors: string, publishedDate: string, query:string) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key not set!");
    throw new Error("Error: API key not set.");
  }
console.log ("Prompt received info:", title, authors, publishedDate, query )
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
            "role": "system",
            "content": `You will be provided with a book name, its authors, the publishedDate and the query of question regarding this book.
            Your task is to define a book, and if you know its content - to generate answer for the question regarding the book within a certain token number. 
            You should generate answer within the context of the book or its author. if the question is not relevent answer like "Please provide relevance to the book" .`
            
        },
        {
            "role": "user",
            "content": `Answer the question: ${query} regarding the Book: ${title} by ${authors} published ${publishedDate}.`
        }
        
      ],
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || "Error: Failed to get a summarized response.";

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
      return "Error: API returned an error.";
    } else {
      console.error(error);
      return "Error summarizing the text.";
    }
  }
};
