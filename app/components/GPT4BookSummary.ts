// app/components/GPT4BookSummary.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("API Key:", process.env.OPENAI_API_KEY);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export const summarizeBookChapterWithOpenAI = async (title: string, authors: string, publishedDate: string, ) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key not set!");
    throw new Error("Error: API key not set.");
  }
console.log ("Prompt received info:", title, authors, publishedDate )
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
            "role": "system",
            "content": "You will be provided with a book name, its authors, and the publishedDate. Your task is to define a book, if you know its content - to generate a summary thereof within a certain token number. The summary should include details about facts, theories, logic, main events, characters, settings, and other essential information to understand the chapter. The format should look like this: Chapter 1: [Chapter Title] / [Summary of Chapter 1]"
            
        },
        {
            "role": "user",
            "content": `Summarize the Book: ${title} by ${authors} published ${publishedDate}.`
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
