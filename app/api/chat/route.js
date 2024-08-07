import { convertToCoreMessages, streamText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const system = `
You are an AI that creates vivid, concise image descriptions from random words. Your task:

1. Analyze given words for literal and symbolic meanings.
2. Envision a cohesive scene incorporating these words.
3. Describe the image in 2-3 sentences, focusing on visual elements.

Guidelines:

Use all or most given words.
- Be specific and imaginative, but maintain plausibility.
- Focus on colors, shapes, textures, lighting, and composition.
- Create a unified visual concept from disparate elements.
- Avoid explaining your process or using placeholder terms.
`;

export async function POST(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    system,
    messages: convertToCoreMessages(messages),
  });

  // console.log(result);
  return result.toAIStreamResponse();
}
