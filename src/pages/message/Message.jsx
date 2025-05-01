import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import getUserFromToken from "./../common/GetUserFromToken";
import { useParams } from "react-router-dom";
import { startConnection } from "../../assets/Services/SignalService";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";

const Message = () => {
  const { receiverId } = useParams();
  const sender = getUserFromToken();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const isModal = !!location.state?.background;
  const [senderAvatar, setSenderAvatar] = useState("");
  const [receiverAvatar, setReceiverAvatar] = useState("");
  const [senderInfo, setSenderInfo] = useState({});
  const [receiverInfo, setReceiverInfo] = useState({});

  const { receiverId: receiverIdFromParams } = useParams();



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        if (sender?.id) {
          const resSender = await axios.get(
            `https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetById?Id=${sender.id}`
          );
          const data = resSender.data?.data;
          if (data) {
            setSenderAvatar(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/${data.userImagePath}`);
            setSenderInfo({ name: data.name, surname: data.surname });
          }
        }
    
        if (receiverId) {
          const resReceiver = await axios.get(
            `https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetById?Id=${receiverId}`
          );
          const data = resReceiver.data?.data;
          if (data) {
            setReceiverAvatar(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/${data.userImagePath}`);
            setReceiverInfo({ name: data.name, surname: data.surname });
          }
        }
      } catch (error) {
        console.error("Profil məlumatları alınarkən xəta:", error);
      }
    };
    
  
    fetchAvatars();
  }, [sender?.id, receiverId]);
  
  

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
        `https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/Chat/getMessages?senderId=${sender.id}&receiverId=${receiverId}`,
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
        "https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/Chat/send",
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
    <div
      className={`${
        isModal
          ? "fixed inset-0 bg-black/10 flex justify-end items-end z-50"
          : "max-w-3xl mx-auto h-screen"
      } flex flex-col p-4`}
    >
      <div
        className={`${
          isModal
            ? "bg-white rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[85%] overflow-y-auto animate-fade-in-up relative"
            : "w-full"
        } transition-all duration-300`}
      >
        {isModal && (
          <button
            onClick={() => window.history.back()}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        )}
  
        <h2 className="text-xl font-bold mb-4 text-center pt-4">💬 Söhbət</h2>
  
        <MessageList
          messages={messages}
          senderId={sender.id}
          senderAvatar={senderAvatar}
          receiverAvatar={receiverAvatar}
          senderName={`${senderInfo.name} ${senderInfo.surname}`}
          receiverName={`${receiverInfo.name} ${receiverInfo.surname}`}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
  
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleKeyPress={handleKeyPress}
          handleSend={handleSend}
          connection={connection}
        />
      </div>
    </div>
  );
  
  
};

export default Message;
