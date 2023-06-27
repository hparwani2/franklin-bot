import { chunkText } from "./chunkText.js";
import { embedding } from "./openai.js";

const MAX_CHAR_LENGTH = 250 * 4;
export async function getEmbeddingsForText(text, maxCharLength = MAX_CHAR_LENGTH, batchSize = 20) {
    const textChunks = chunkText(text, maxCharLength);
    const batches = [];
    for (let i = 0; i < textChunks.length; i += batchSize) {
        batches.push(textChunks.slice(i, i + batchSize));
    }
    try {
        const batchPromises = batches.map((batch) => embedding(batch));
    
        const embeddings = (await Promise.all(batchPromises)).flat();
    
        const textEmbeddings = embeddings.map((embedding, index) => ({
          embedding,
          text: textChunks[index],
        }));
        return textEmbeddings;
    } catch (error) {
        console.log("Error: ", error);
        return [];
    }

}