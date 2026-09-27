"use client";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({
  src,
  name,
  size = "md",
}: AvatarProps) {
  const sizes = {
    sm: "w-9 h-9 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const letter =
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        overflow-hidden
        shrink-0
        bg-[#27272a]
        flex
        items-center
        justify-center
        text-white
        font-medium
        select-none
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        letter
      )}
    </div>
  );
}