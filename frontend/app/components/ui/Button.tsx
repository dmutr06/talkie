import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "square" | "full" | "default",
}

export default function Button({ size = "default", children, className, ...props }: ButtonProps) {
  const getButtonClasses = () => {
    switch (size) {
      case "square": return "w-12 h-12 p-0";
      case "full": return "w-full p-3";
      default: return "px-4 py-2";
    }
  } 

  return (
    <button
      className={`cursor-pointer ${className || ""} bg-indigo-950 hover:bg-indigo-900 transition duration-300ms ${getButtonClasses()}`}
      {...props}>
      {children}
    </button>
  );
}
