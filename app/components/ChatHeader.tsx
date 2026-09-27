"use client";

import Avatar from "./Avatar";

type ChatHeaderProps = {
  phone: string;
  username?: string | null;
  avatar?: string | null;
  onBack?: () => void;
};

export default function ChatHeader({
  phone,
  username,
  avatar,
  onBack,
}: ChatHeaderProps) {
  return (
    <header className="h-[72px] bg-[#202c33] shrink-0 border-b border-white/10 px-4 md:px-6 flex items-center">
      
      <button
        onClick={onBack}
        className="md:hidden mr-3 text-2xl text-gray-400 hover:text-white transition"
      >
        ←
      </button>

      <div className="flex items-center gap-3">
        
        {/* Аватар */}
        <Avatar
          src={avatar}
          name={username || phone}
          size="lg"
        />

        <div>
          <h2 className="font-medium">
            {phone}
          </h2>

          {username ? (
            <p className="text-xs text-gray-500">
              {username}
            </p>
          ) : (
            <p className="text-xs text-green-400">
              online
            </p>
          )}
        </div>

      </div>
    </header>
  );
}