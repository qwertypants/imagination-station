"use client";

import { useChat } from "ai/react";
import React, { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import { cards, myMessages } from "@/app/consts";
import { generate } from "random-words";

const maxSelectedWords = 10;
const maxGeneratedWords = 5;

async function getImage(messages) {
  const res = fetch("/api/image", {
    headers: { accept: "application/json" },
    method: "post",
    body: JSON.stringify({ prompt: messages[messages.length - 1].content }),
  });

  const image = await res.json();
  return image.url;
}

export default function Page() {
  const [gallery, setGallery] = useState([]);
  const [randomWords, setRandomWords] = useState([""]);

  function generateWords() {
    const words = generate(maxGeneratedWords);
    setRandomWords(words);
  }

  useEffect(() => {
    const localGallery = localStorage.getItem("gallery");
    if (localGallery) {
      setGallery(JSON.parse(localGallery));
    }
    generateWords();
  }, []);

  const { messages, input, handleSubmit, setInput } = useChat({
    onFinish: async (messages) => {
      // const image = await getImage(messages.content);
      // setGallery([...gallery, image.url]);
    },
  });
  // console.log(input);
  return (
    <section className="container mx-auto max-w-5xl">
      <div className="mt-10 h-[25vh] overflow-y-scroll">
        {/*{messages.map((message) => (*/}
        {/*  <div key={message.id}>*/}
        {/*    {message.role === "user" ? "User: " : "AI: "}*/}
        {/*    {message.content}*/}
        {/*  </div>*/}
        {/*))}*/}
        {myMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full py-4">
        <button type="submit">Submit</button>
      </form>

      <div className="w-full columns-2">
        <div className="flex gap-2 py-4">
          <button type="button" onClick={generateWords} className="text-3xl">
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
              className="rounded bg-slate-200 px-2 py-1 font-semibold shadow-sm disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex gap-2 py-4">
          <button type="button" className="text-3xl">
            ▶️
          </button>
          <p className="flex items-center">{input}</p>
        </div>
      </div>

      <div className="h-[60vh] overflow-y-scroll">
        <div className="columns-3">
          {cards.map((card, index) => (
            <Card
              key={index}
              image={card.image}
              description={card.description}
              tags={card.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
