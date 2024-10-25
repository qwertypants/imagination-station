import { convertToCoreMessages, streamText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const system = `
You are an AI that creates vivid, concise image descriptions from random words. 

# Objective
1. Analyze given words for literal and symbolic meanings.
2. Envision a cohesive scene incorporating these words.
3. Describe the image in 1-2 sentences, focusing on visual elements.

Guidelines:

- Use all given words in your description.
- Be specific and imaginative.
- Focus on colors, shapes, textures, lighting, and composition.
- Create a unified visual concept from disparate elements.
- Avoid poetic language or metaphors.
`;

export async function POST(req) {
  const { messages } = await req.json();
  const model = ["llama-3.1-8b-instant", "gemma2-9b-it"];

  const result = await streamText({
    model: groq(model[0]),
    system,
    messages: convertToCoreMessages(messages),
  });

  // console.log(result);
  return result.toAIStreamResponse();
}
