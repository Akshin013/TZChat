"use client";

type ChatHeaderProps = {
  phone: string;
  username?: string | null;
  onBack?: () => void;
};

export default function ChatHeader({
  phone,
  username,
  onBack,
}: ChatHeaderProps) {
  return (
    <header className="h-[72px] shrink-0 border-b border-white/10 px-4 md:px-6 flex items-center">
      <button
        onClick={onBack}
        className="md:hidden mr-3 text-2xl text-gray-400 hover:text-white transition"
      >
        ←
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#272b32] flex items-center justify-center text-sm">
          +
        </div>

        <div>
          <h2 className="font-medium">
            {phone}
          </h2>
        
          {username ? (
            <p className="text-xs text-gray-500">{username}</p>
          ) : (
            <p className="text-xs text-green-400">online</p>
          )}
        </div>
      </div>
    </header>
  );
}