interface AvatarProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "responsive";
}

const sizeClasses = {
  sm: "w-16 h-16 text-lg",
  md: "w-20 h-20 text-xl",
  lg: "w-24 h-24 text-2xl",
  responsive:
    "w-16 h-16 text-lg sm:w-20 sm:h-20 sm:text-xl md:w-24 md:h-24 md:text-2xl",
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
  ];

  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const Avatar = ({
  name,
  selected = false,
  onClick,
  size = "md",
}: AvatarProps) => {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <button
      onClick={onClick}
      className={`${
        sizeClasses[size]
      } ${bgColor} rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
        onClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""
      } ${selected ? "ring-4 ring-primary-500 ring-offset-2 scale-110" : ""}`}
      type="button"
    >
      {initials}
    </button>
  );
};
