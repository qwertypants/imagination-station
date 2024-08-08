"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";

import { generate } from "random-words";

const minSelectedWords = 4;
const maxSelectedWords = 8;
const generatedWords = 12;

async function getImage(prompt) {
  const res = await fetch("/api/image", {
    headers: { accept: "application/json" },
    method: "post",
    body: JSON.stringify({ prompt }),
  });

  const image = await res.json();
  return image.url;
}

export default function Page() {
  const [gallery, setGallery] = useState([]);
  const [randomWords, setRandomWords] = useState([""]);

  function generateWords() {
    const words = generate(generatedWords);
    setRandomWords(words);
  }

  async function handleFinish(messages) {
    const { content } = messages;
    const image = await getImage(content);
    const card = {
      date: new Date().toISOString(),
      content,
      image,
      tags: input.split(" ").filter((el) => el !== ""),
    };
    const newGallery = [...gallery, { ...card }];
    localStorage.setItem("gallery", JSON.stringify(newGallery));

    generateWords();
    setInput("");
    setGallery(newGallery);
  }

  useEffect(() => {
    const localGallery = localStorage.getItem("gallery");

    if (localGallery) {
      setGallery(JSON.parse(localGallery));
    } else {
      // localStorage.setItem("gallery", JSON.stringify(cards)); // Sample set
    }
    generateWords();
  }, []);

  const { messages, input, handleSubmit, setInput, isLoading } = useChat({
    onFinish: async (messages) => await handleFinish(messages),
  });

  return (
    <section className="container mx-auto max-w-7xl p-4">
      <h1 className={`${isLoading ? "animate-pulse" : ""}`}>words ➡️ image</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <div className="flex flex-wrap gap-2 py-2">
            <button
              type="button"
              onClick={generateWords}
              className="text-3xl disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                input.split(" ").length - 1 >= maxSelectedWords || isLoading
              }
            >
              🔀
            </button>
            {randomWords.map((word, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setInput(input.concat(`${word} `))}
                disabled={
                  input.includes(word) ||
                  input.split(" ").length - 1 >= maxSelectedWords ||
                  isLoading
                }
                className="rounded bg-slate-200 px-2 py-1 font-semibold shadow-sm shadow-black hover:shadow-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {word}
              </button>
            ))}
          </div>
          <div className="flex gap-2 py-2">
            <button
              type="button"
              className="text-3xl disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                input.split(" ").length - 1 < minSelectedWords || isLoading
              }
              onClick={handleSubmit}
            >
              ▶️
            </button>
            <p className="flex items-center">{input}</p>
          </div>
          <div className="h-3/4 overflow-y-scroll rounded-md bg-gray-50 p-2 text-sm">
            {messages.map((message) => (
              <p
                key={message.id}
                className={`${message.role === "user" ? "text-gray-400" : "text-gray-700"}`}
              >
                {message.content}
              </p>
            ))}
          </div>
        </div>
        <div className="h-[95vh] w-full overflow-y-scroll p-2 md:w-2/3">
          {gallery
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((card, index) => {
              const { image, content, tags } = card;
              return (
                <div
                  key={index}
                  className="mb-4 w-full overflow-hidden rounded-md shadow-sm shadow-red-900"
                >
                  <img
                    src={image}
                    alt={content}
                    className="w-full object-cover"
                  />
                  <div className="px-4">
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-gray-100 bg-gradient-to-r from-amber-50 to-red-50 px-2 py-1 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mb-2 py-2 text-gray-700">{content}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
