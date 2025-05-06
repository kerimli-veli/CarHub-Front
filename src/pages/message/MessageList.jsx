import React from "react";

const MessageList = ({
  messages,
  senderId,
  senderAvatar,
  receiverAvatar,
  senderName,
  receiverName,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 space-y-6">

      {/* Tarix */}
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 px-3 py-1 rounded-lg bg-gray-100">
          Today, Jan 24
        </div>
      </div>

      {/* Mesajlar */}
      {messages.map((msg, idx) => {
        const isOwnMessage = Number(msg.senderId) === Number(senderId);
        const avatarUrl = isOwnMessage ? senderAvatar : receiverAvatar;
        const userName = isOwnMessage ? "You" : receiverName;

        const previousMessage = idx > 0 ? messages[idx - 1] : null;
        const isFirstMessageOfGroup = !previousMessage || previousMessage.senderId !== msg.senderId;

        return (
          <div
            key={idx}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} gap-2`}
          >

            {/* Avatar və ya boş yer */}
            {isFirstMessageOfGroup ? (
              <div className={`flex flex-col -mt-[2%] items-center w-13 ${isOwnMessage ? "order-2" : ""}`}>
                <img src={avatarUrl} alt="avatar" className="w-13 h-13 rounded-full object-cover" />
              </div>
            ) : (
              <div className={`w-13 ${isOwnMessage ? "order-2" : ""}`} />
            )}

            <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[80%]`}>

              {isFirstMessageOfGroup && (
                <div className={`flex gap-3 flex-col -mt-[5%] ${isOwnMessage ? "items-end" : "items-start"} mb-1`}>
                  
                  <span className="text-[20px] font-semibold text-gray-900">{userName}</span>
                  <span className="text-xs mt-[1%] text-gray-400"
                    >
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>  
                </div>
                
              )}

              {/* Mesaj bubble */}
              <div
                className={`px-4 py-2 rounded-2xl text-[14px] ${
                  isOwnMessage
                    ? "bg-green-500 text-white "
                    : "bg-gray-100 text-gray-900 "
                }`}
              >
                {msg.text}
                
              </div>

            </div>

          </div>
        );
      })}

      {/* Typing göstəricisi */}
      {isTyping && (
        <div className="flex items-center gap-2 mt-4">
          <img src={receiverAvatar} alt="Typing" className="w-6 h-6 rounded-full" />
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl text-sm rounded-bl-none">
            <div className="dot-flashing"></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      {/* Typing Animation */}
      <style>{`
        .dot-flashing {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background-color: #999;
          animation: dotFlashing 1s infinite linear alternate;
        }

        @keyframes dotFlashing {
          0% { background-color: #999; }
          50%, 100% { background-color: #ccc; }
        }
      `}</style>

    </div>
  );
};

export default MessageList;
