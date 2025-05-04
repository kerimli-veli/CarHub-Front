import React from "react";
export default function DropdownButton({ icon, label, active, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-[10px] rounded-[10px] text-sm font-medium transition flex-shrink-0
          ${active ? "bg-green-500 text-white" : "bg-[#3C4B61] text-white hover:bg-[#46566D]"}`}
      >
        {icon}
        <span>{label}</span>
        <span className="text-xs">▼</span>
      </button>
    );
  }
  