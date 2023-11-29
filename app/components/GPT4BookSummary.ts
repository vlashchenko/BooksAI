// pages/api/BookSummarizer.ts

import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("API Key:", process.env.OPENAI_API_KEY); // Add this line

export const summarizeBookChapterWithOpenAI = async (title: string, authors: string, publishedDate: string, ) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key not set!");
    throw new Error("Error: API key not set.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
            "role": "system",
            "content": "You will be provided with a book name, its authors, and the publishedDate. Your task is to generate a summary thereof within a certain token number. The summary should include details about facts, theories, logic, main events, characters, settings, and other essential information to understand the chapter. Please provide the summary in a JSON-like format, with each chapter title as the key and its summary as the value. For example: {\"Chapter 1: The Beginning\": \"This chapter talks about ...\", \"Chapter 2: The Journey\": \"In this chapter, ...\"}."
        },
        {
            "role": "user",
            "content": `Summarize any 3 chapters (III, IV, V) of the Book: ${title} by ${authors} published ${publishedDate}.`
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
