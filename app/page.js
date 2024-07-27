"use client";

import { useChat } from "ai/react";
import React, { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import { cards, myMessages } from "@/app/consts";

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
  const [words, setWords] = useState(["hi", "hello", "hey"]);

  useEffect(() => {
    const localGallery = localStorage.getItem("gallery");
    if (localGallery) {
      setGallery(JSON.parse(localGallery));
    }
  }, []);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async (messages) => {
      // const image = await getImage(messages.content);
      // setGallery([...gallery, image.url]);
    },
  });

  return (
    <section className="container mx-auto p-4 max-w-5xl">
      <div className="bg-slate-200 h-[25vh] overflow-y-scroll relative">
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

      <form onSubmit={handleSubmit} className="bg-yellow-50 w-full">
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>

      <div className="w-full columns-2 py-10">
        <div className="flex gap-2">
          {words.map((word, index) => (
            <button
              key={index}
              type="button"
              className="rounded px-2 py-1 text-xs font-semibold bg-slate-200 shadow-sm"
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex gap-2 my-10">
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-semibold bg-slate-200 shadow-sm"
          >
            refresh words
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-semibold bg-slate-200 shadow-sm"
          >
            submit
          </button>
        </div>
      </div>

      <div className="h-[60vh] bg-red-50 overflow-y-scroll columns-1 sm:columns-2 md:columns-3 gap-2">
        {cards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            description={card.description}
            tags={card.tags}
          />
        ))}
      </div>
    </section>
  );
}
