import React from "react";
import { FiImage, FiSmile, FiMic, FiSend } from "react-icons/fi";

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleKeyPress,
  handleSend,
  connection,
}) => {
  return (
    <div className="p-4 border-t flex items-center gap-2 bg-white">
      <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4">
        <textarea
          rows="1"
          className="flex-1 bg-transparent p-2 resize-none focus:outline-none"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />

      </div>

      <button
        onClick={handleSend}
        disabled={!connection}
        className={`ml-2 p-3 rounded-full ${
          connection ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
        } text-white transition`}
      >
        <FiSend size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
