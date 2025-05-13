import React, { useEffect, useRef } from "react";
import "./AuctionParticipants.css"; 

const AuctionParticipants = ({ messages }) => {
  const containerRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
  const container = containerRef.current;
  const isUserAtBottom =
    container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

  if (container && endRef.current && isUserAtBottom) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages]);


  return (
    <div
      ref={containerRef}
      className="custom-scroll overflow-y-auto h-[330px]"
    >
      {messages.length > 0 && (
        <ul className="space-y-2">
          {messages.map((msg, index) => {
            const isJoin = msg.toLowerCase().includes("join");
            const isLeave = msg.toLowerCase().includes("left");

            const textColor = isJoin
              ? "text-green-500"
              : isLeave
              ? "text-red-500"
              : "text-gray-700";

            const bgColor = isJoin
              ? "bg-green-100"
              : isLeave
              ? "bg-red-100"
              : "bg-white";

            return (
              <li
                key={index}
                className={`flex items-start text-sm px-3 py-2 rounded-md shadow-sm ${bgColor} ${textColor} animate-fade-in`}
              >
                <div className="mr-2 mt-1">
                  <img
                    src="https://i.postimg.cc/bwffRW8k/Screenshot-2025-05-12-151133.png"
                    alt="icon"
                    className="w-4 h-4"
                  />
                </div>
                <span>{msg}</span>
              </li>
            );
          })}
          <div ref={endRef} />
        </ul>
      )}
    </div>
  );
};

export default AuctionParticipants;
