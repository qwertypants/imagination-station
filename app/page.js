"use client";
import { useFormStatus } from "react-dom";

import { useChat } from "ai/react";
import React, { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import { cards } from "@/app/consts";

import { generate } from "random-words";

const minSelectedWords = 4;
const maxSelectedWords = 8;
const generatedWords = 10;

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
  const { pending } = useFormStatus();

  function generateWords() {
    const words = generate(generatedWords);
    setRandomWords(words);
  }

  async function handleFinish(messages) {
    const { content } = messages;
    const image = await getImage(content);
    const newCard = {
      content,
      image,
      tags: input.split(" ").filter((el) => el !== ""),
    };
    const newGallery = [...gallery, { ...newCard }];
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
      // Sample set
      localStorage.setItem("gallery", JSON.stringify(cards));
    }
    generateWords();
  }, []);

  const { messages, input, handleSubmit, setInput } = useChat({
    onFinish: async (messages) => await handleFinish(messages),
  });

  return (
    <section className="container mx-auto max-w-5xl px-4">
      <h1>words ➡️ image</h1>
      <div className="mt-10 h-[25vh] overflow-y-scroll">
        {messages.map((message) => (
          <p key={message.id}>
            {message.role === "user" ? "words: " : "prompt: "}
            {message.content}
          </p>
        ))}
      </div>

      <div className="w-full columns-1 gap-2 lg:columns-2">
        <div className="flex flex-wrap gap-2 py-4">
          <button
            type="button"
            onClick={generateWords}
            className="text-3xl disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              input.split(" ").length - 1 >= maxSelectedWords || pending
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
                input.split(" ").length - 1 >= maxSelectedWords
              }
              className="rounded bg-slate-200 px-2 py-1 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex gap-2 py-4">
          <button
            type="button"
            className="text-3xl disabled:cursor-not-allowed disabled:opacity-50"
            disabled={input.split(" ").length - 1 < minSelectedWords}
            onClick={handleSubmit}
          >
            ▶️
          </button>
          <p className="flex items-center">{input}</p>
        </div>
      </div>

      <div className="h-[60vh] overflow-y-scroll">
        <div className="columns-3">
          {gallery.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
