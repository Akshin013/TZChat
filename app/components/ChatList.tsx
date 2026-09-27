"use client";
import type { Message, Chat } from "../lib/types";
import Avatar from "./Avatar";

type ChatListProps = {
  chats: Chat[];
  selectedChat: string;
  search: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
};

export default function ChatList({
  chats,
  selectedChat,
  search,
  onSelectChat,
  onDeleteChat,
}: ChatListProps) {
  const filtered = chats.filter(
    (c) =>
      c.phone.includes(search) || c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );
console.log(chats);

  return (
    <ul className="flex flex-col">
      {filtered.map((chat) => {
        const isActive = chat.id === selectedChat;
        const hasUnread = chat.unreadCount > 0;

        return (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
              isActive ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#272b32] flex items-center justify-center text-sm">
              <Avatar
  src={chat.avatar}
  name={chat.name || chat.username || chat.phone}
  size="md"
/>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm truncate ${
                    hasUnread ? "font-semibold text-white" : "font-medium text-gray-200"
                  }`}
                >
                  {chat.phone}

                  
                </span>
              </div>

              <p
                className={`text-xs truncate ${
                  hasUnread ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {chat.lastMessage || "Нет сообщений"}
              </p>
            </div>

            {hasUnread && (
              <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#25D366] text-black text-[11px] font-semibold flex items-center justify-center">
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex w-6 h-6 items-center justify-center rounded-md bg-black/40 hover:bg-red-500/80 text-xs"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}