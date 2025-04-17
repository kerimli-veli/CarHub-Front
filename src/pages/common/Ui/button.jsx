import React from "react";

export const Button = ({ children, className = "", variant = "default", ...props }) => {
  let base = "px-4 py-2 rounded font-semibold transition";

  if (variant === "outline") {
    base += " border border-gray-400 text-gray-700 bg-white hover:bg-gray-100";
  } else if (variant === "link") {
    base += " text-blue-600 underline bg-transparent px-0 py-0";
  } else {
    base += " bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};
