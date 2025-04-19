import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import getUserFromToken from "./../common/GetUserFromToken";
import { useParams } from "react-router-dom";
import {
  startConnection,
  registerOnMessage,
} from "../../assets/Services/SignalService";

const Message = () => {
  const { receiverId } = useParams();
  const sender = getUserFromToken();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!sender?.id || !receiverId) return;

    const setupConnection = async () => {
      const conn = await startConnection();
      setConnection(conn);

      registerOnMessage((incomingSenderId, incomingReceiverId, messageText) => {
        if (
          (parseInt(incomingSenderId) === parseInt(sender.id) &&
            parseInt(incomingReceiverId) === parseInt(receiverId)) ||
          (parseInt(incomingSenderId) === parseInt(receiverId) &&
            parseInt(incomingReceiverId) === parseInt(sender.id))
        ) {
          setMessages((prev) => [
            ...prev,
            {
              senderId: parseInt(incomingSenderId),
              text: messageText,
              sentAt: new Date(),
            },
          ]);
        }
      });

      const res = await axios.get(
        `https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Chat/getMessages?senderId=${sender.id}&receiverId=${receiverId}`,
        { withCredentials: true }
      );
      setMessages(res.data || []);
    };

    setupConnection();
  }, [sender?.id, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
  
    try {
      const response = await axios.post(
        "https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Chat/send",
        {
          senderId: sender.id,
          receiverId: parseInt(receiverId),
          text: newMessage,
        },
        {
          withCredentials: true,
        }
      );
  
      if (response.data) {
        await connection.invoke("SendMessage", receiverId, newMessage);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Mesaj göndərilərkən xəta:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4 text-center">💬 Söhbət</h2>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-3">
        {messages.map((msg, idx) => {
          const isOwnMessage = Number(msg.senderId) === Number(sender.id);
          return (
            <div
              key={idx}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-md text-sm leading-snug ${
                  isOwnMessage
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <div className="text-[10px] text-right mt-1 opacity-70">
                  {new Date(msg.sentAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <textarea
          rows="1"
          className="flex-1 border rounded-full p-3 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition"
        >
          Göndər
        </button>
      </div>
    </div>
  );
};

export default Message;
