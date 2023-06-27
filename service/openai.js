import {
    Configuration,
    OpenAIApi,
  } from "openai";

import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
  

export async function embedding(input, model = "text-embedding-ada-002") {
    const result = await openai.createEmbedding({
        model,
        input,
    });

    if (!result.data.data[0].embedding) {
        throw new Error("No embedding returned from the completions endpoint");
    }

    // Otherwise, return the embeddings
    return result.data.data.map((d) => d.embedding);
}