import React from "react";
const AuctionParticipants = ({ messages }) => {
    return (
      <div className="overflow-y-auto h-[230px] pr-2">
        {messages.length > 0 && (
          <ul className="list-disc list-inside space-y-1">
            {messages.map((msg, index) => {
              const isJoin = msg.toLowerCase().includes("join");
              const isLeave = msg.toLowerCase().includes("left");
  
              const textColor = isJoin
                ? "text-green-500 font-semibold"
                : isLeave
                ? "text-red-500 font-semibold"
                : "text-gray-700";
  
              return (
                <li
                  key={index}
                  className={`relative pl-6 ${textColor} list-none left-0 top-1 h-5 bg-no-repeat bg-contain`}
                  style={{
                    backgroundImage:
                      "url('https://i.postimg.cc/bwffRW8k/Screenshot-2025-05-12-151133.png')",
                  }}
                >
                  {msg}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };
  
  export default AuctionParticipants;
  