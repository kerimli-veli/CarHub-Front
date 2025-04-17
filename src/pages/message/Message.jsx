import React, { useEffect, useState } from "react";
import axios from "axios";
import getUserFromToken from "../common/GetUserFromToken";
import { useParams } from "react-router-dom";

const Message = () => {
  const { receiverId } = useParams();
  const sender = getUserFromToken();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (sender?.id && receiverId) {
      axios
        .get(`https://localhost:7282/api/Chat/getMessages?senderId=${sender.id}&receiverId=${receiverId}`)
        .then((res) => {
          console.log("API-dən gələn mesajlar:", res.data);
          setMessages(res.data || []);
        })
        .catch((err) => console.error("Mesajlar alınarkən xəta:", err));
    }
  }, [sender?.id, receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post("https://localhost:7282/api/Chat/send", {
        senderId: sender.id,
        receiverId: parseInt(receiverId),
        text: newMessage,
      });

      if (response.data) {
        setMessages([...messages, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Mesaj göndərilərkən xəta:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Söhbət</h2>
      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-100 space-y-2">
  {messages.map((msg, idx) => (
    <div
      key={idx}
      className={`w-full flex ${
        msg.senderId === sender.id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-3 rounded-lg max-w-[70%] break-words ${
          msg.senderId === sender.id
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{msg.text}</p>
        <div className="text-[10px] text-right mt-1 opacity-70">
          {new Date(msg.sentAt).toLocaleString()}
        </div>
      </div>
    </div>
  ))}
</div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-md p-2"
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-md"
        >
          Göndər
        </button>
      </div>
    </div>
  );
};

export default Message;
