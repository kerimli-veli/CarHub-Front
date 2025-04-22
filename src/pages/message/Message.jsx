import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import getUserFromToken from "./../common/GetUserFromToken";
import { useParams } from "react-router-dom";
import { startConnection } from "../../assets/Services/SignalService";

const Message = () => {
  const { receiverId } = useParams();
  const sender = getUserFromToken();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  const senderAvatar = "https://randomuser.me/api/portraits/men/75.jpg";
  const receiverAvatar = "https://randomuser.me/api/portraits/women/65.jpg";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!sender?.id || !receiverId) return;

    let conn;
    const onMessage = (incomingSenderId, incomingReceiverId, messageText) => {
      const isBetweenUsers =
        (parseInt(incomingSenderId) === parseInt(sender.id) &&
          parseInt(incomingReceiverId) === parseInt(receiverId)) ||
        (parseInt(incomingSenderId) === parseInt(receiverId) &&
          parseInt(incomingReceiverId) === parseInt(sender.id));

      if (isBetweenUsers) {
        const newMsg = {
          senderId: parseInt(incomingSenderId),
          text: messageText,
          sentAt: new Date(),
        };

        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) =>
              m.text === newMsg.text &&
              m.senderId === newMsg.senderId &&
              Math.abs(new Date(m.sentAt) - new Date(newMsg.sentAt)) < 2000
          );
          return isDuplicate ? prev : [...prev, newMsg];
        });
      }
    };

    const setupConnection = async () => {
      conn = await startConnection();
      setConnection(conn);
      conn.on("ReceiveMessage", onMessage);
    
      const res = await axios.get(
        `https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Chat/getMessages?senderId=${sender.id}&receiverId=${receiverId}`,
        { withCredentials: true }
      );
    
      const fetchedMessages = res.data || [];
    
      setMessages((prev) => {
        const combined = [...prev, ...fetchedMessages];
      
        const uniqueMessages = [];
        const seen = new Set();
      
        for (const msg of combined) {
          const key = `${msg.senderId}-${msg.text}-${new Date(msg.sentAt).getTime()}`;
      
          // 2 saniyəlik fərqlə gələn mesajları da eyni saymaq üçün
          const existing = uniqueMessages.find((m) =>
            m.senderId === msg.senderId &&
            m.text === msg.text &&
            Math.abs(new Date(m.sentAt) - new Date(msg.sentAt)) < 2000
          );
      
          if (!existing) {
            uniqueMessages.push(msg);
          }
        }
      
        return uniqueMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      });
      
    };
    
    setupConnection();
  }, [sender?.id, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !connection) return;
  
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
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Mesaj göndərilərkən xəta:", error);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      handleTyping();
    }
  };

  const handleTyping = () => {
    if (connection && receiverId) {
      connection.invoke("SendTyping", receiverId).catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (!connection) return;

    const handleTypingReceived = (typingSenderId) => {
      if (parseInt(typingSenderId) === parseInt(receiverId)) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    connection.on("ReceiveTyping", handleTypingReceived);

    return () => {
      connection.off("ReceiveTyping", handleTypingReceived);
    };
  }, [connection, receiverId]);

  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4 text-center">💬 Söhbət</h2>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-3">
        {messages.map((msg, idx) => {
          const isOwnMessage = Number(msg.senderId) === Number(sender.id);
          const avatarUrl = isOwnMessage ? senderAvatar : receiverAvatar;

          return (
            <div
              key={idx}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                {!isOwnMessage && (
                  <img src={avatarUrl} className="w-8 h-8 rounded-full mr-2" alt="avatar" />
                )}
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
                {isOwnMessage && (
                  <img src={avatarUrl} className="w-8 h-8 rounded-full ml-2" alt="avatar" />
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start items-center gap-2 mt-2">
            <img src={receiverAvatar} alt="Typing" className="w-8 h-8 rounded-full" />
            <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl shadow text-sm rounded-bl-none">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}

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
  disabled={!connection}
  className={`px-5 py-2 rounded-full font-medium transition ${
    connection
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-400 cursor-not-allowed text-white"
  }`}
>
  Göndər
</button>

      </div>

      <style>{`
        .dot-flashing {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background-color: #999;
          color: #999;
          animation: dotFlashing 1s infinite linear alternate;
        }

        @keyframes dotFlashing {
          0% {
            background-color: #999;
          }
          50%, 100% {
            background-color: #ccc;
          }
        }
      `}</style>
    </div>
  );
};

export default Message;
