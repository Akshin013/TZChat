"use client";

import { useEffect, useRef } from "react";

type Message = {
  id: string | number;
  text: string;
  incoming: boolean;
  time: string;
};

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center animate-[fadeIn_0.4s_ease-out]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] flex items-center justify-center text-2xl shadow-inner">
            💬
          </div>

          <p className="text-gray-300 font-medium">Нет сообщений</p>

          <p className="text-sm text-gray-600 mt-1">
            Напишите первое сообщение, чтобы начать диалог
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth">
      <div className="flex flex-col gap-1 max-w-3xl mx-auto">
        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];

          const isFirstInGroup = !prev || prev.incoming !== msg.incoming;
          const isLastInGroup = !next || next.incoming !== msg.incoming;

          return (
            <div
              key={msg.id}
              className={`flex ${msg.incoming ? "justify-start" : "justify-end"} ${
                isFirstInGroup ? "mt-3" : "mt-0.5"
              }`}
            >
              <div
                className={[
                  "max-w-[75%] sm:max-w-[65%] px-4 py-2.5 shadow-sm",
                  "animate-[fadeInUp_0.25s_ease-out]",
                  "transition-transform hover:-translate-y-[1px]",
                  msg.incoming
                    ? "bg-[#1b1e24] text-white"
                    : "bg-white text-black",
                  // скругления с "хвостиком" у последнего сообщения в группе
                  msg.incoming
                    ? `rounded-2xl ${isLastInGroup ? "rounded-bl-md" : ""} ${
                        isFirstInGroup ? "" : "rounded-tl-md"
                      }`
                    : `rounded-2xl ${isLastInGroup ? "rounded-br-md" : ""} ${
                        isFirstInGroup ? "" : "rounded-tr-md"
                      }`,
                ].join(" ")}
              >
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </p>

                <div
                  className={`text-[10px] mt-1 text-right select-none ${
                    msg.incoming ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}