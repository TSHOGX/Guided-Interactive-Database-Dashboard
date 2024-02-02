"use client";

import { ChatBox } from "@/components/ChatBox";

export default function Ollama() {
  return (
    <div className=" min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className=" container mx-auto">
        <div className=" flex min-h-[10svh] flex-col items-center justify-between py-[5svh]">
          <div className=" text-2xl">Chat With Ollama</div>
        </div>
        <div className=" grid min-h-[80svh] grid-cols-4 gap-8">
          <div className=" ">
            <div>filesbox</div>
          </div>
          <div className=" col-span-3 flex max-h-[80svh] flex-col gap-8">
            <ChatBox
              endpoint="api/chat"
              placeholder="Hi, what can I tell you about?"
            ></ChatBox>
          </div>
        </div>
      </div>
    </div>
  );
}
