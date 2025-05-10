// JoinChat.jsx
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const JoinChat = ({ auctionId }) => {
  const [connection, setConnection] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState(""); // Message state əlavə edirik
  const [participantMessages, setParticipantMessages] = useState([]);


  // User ID-ni cookie-dən alırıq
  const getUserId = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    
    if (!token) return null;

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.userId;  
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/auctionHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
  if (!connection) return;

  connection.start()
    .then(() => {
      console.log("SignalR bağlantısı uğurla yaradıldı.");

      connection.on("ParticipantJoined", (participantMessage) => {
        console.log("Real-time mesaj:", participantMessage);
        setParticipantMessages((prev) => [...prev, participantMessage]);
      });

      // Auction-a qoşulma
      const joinAuction = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
          await connection.invoke("JoinAuction", parseInt(auctionId), parseInt(userId));
          console.log("Auction-a SignalR ilə qoşuldu");
        } catch (err) {
          console.error("SignalR JoinAuction xətası:", err);
        }
      };

      joinAuction();
    })
    .catch((err) => console.error("SignalR bağlantı xətası:", err));
}, [connection, auctionId]);



  return (
    <div className="p-4 border border-blue-300 rounded-xl bg-blue-50 text-blue-700 text-sm">
      <h2 className="font-semibold mb-2">Auction-a qoşulanlar:</h2>
      {participantMessages.length > 0 && (
      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2 text-gray-800">Real-time qoşulma mesajları:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {participantMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

      {/* Message kısmını göstəririk */}
      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default JoinChat;
