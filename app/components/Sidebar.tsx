"use client";

import ChatList from "./ChatList";
import type { Message, Chat } from "../lib/types";

type SidebarProps = {
  chats: Chat[];
  selectedChat: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  onDeleteChat: (id: string) => void;
};

export default function Sidebar({
  chats,
  selectedChat,
  search,
  onSearchChange,
  onSelectChat,
  onNewChat,
  onLogout,
  onDeleteChat,
}: SidebarProps) {
  return (
<aside className="w-full  shrink-0 border-r border-white/10 bg-[#111b21] flex flex-col">
      {/* LOGO */}
      <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
            W
          </div>

          <div>
            <h1 className="font-semibold">Whatsapp</h1>

            <p className="text-xs text-gray-500">Messenger</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-xs text-gray-500 cursor-pointer hover:text-white transition"
        >
          Выйти
        </button>
      </div>

      {/* NEW CHAT */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          + Новый чат
        </button>
      </div>

      {/* SEARCH */}
      <div className="px-4 pb-4">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск..."
          className="w-full h-10 rounded-xl bg-[#191c21] border border-white/5 px-4 text-sm outline-none placeholder:text-gray-600 focus:border-white/20"
        />
      </div>

      {/* CHATS */}
      <div className="flex-1 overflow-y-auto">
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          search={search}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
        />
      </div>
    </aside>
  );
}
