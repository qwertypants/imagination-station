import * as fal from "@fal-ai/serverless-client";

export const runtime = "edge";

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req) {
  const { prompt } = await req.json();

  const result = await fal.subscribe("fal-ai/fast-turbo-diffusion", {
    input: {
      image_size: "landscape_16_9",
      prompt,
    },
  });
  // console.log({ prompt, result });

  return new Response(JSON.stringify(result.images[0]), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
