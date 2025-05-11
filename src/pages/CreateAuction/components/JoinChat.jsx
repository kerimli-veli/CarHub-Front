import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const JoinChat = ({ auctionId }) => {
  const [connection, setConnection] = useState(null);
  const [participantMessages, setParticipantMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false); 
  const navigate = useNavigate(); 

  const getUserId = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) return null;

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
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
          setParticipantMessages((prev) => {
            if (prev.includes(participantMessage)) return prev;
            return [...prev, participantMessage];
          });
        });

        connection.on("ParticipantLeft", (leaveMessage) => {
          console.log("Participant left:", leaveMessage);
          setParticipantMessages((prev) => [...prev, leaveMessage]);
        });

        const joinAuction = async () => {
          const userId = getUserId();
          if (!userId) return;

          try {
            await connection.invoke("JoinAuction", parseInt(auctionId), parseInt(userId));
            setJoined(true); 
            console.log("Auction-a SignalR ilə qoşuldu");
          } catch (err) {
            console.error("SignalR JoinAuction xətası:", err);
          }
        };

        joinAuction();
      })
      .catch((err) => console.error("SignalR bağlantı xətası:", err));
  }, [connection, auctionId]);

  const handleLeave = async () => {
    const userId = getUserId();
    if (!userId || !connection) return;
  
    try {
      // 1. SignalR ilə qrupdan çıx
      await connection.invoke("LeaveAuction", parseInt(auctionId), parseInt(userId));
      setJoined(false);
      setMessage("Auction-dan çıxıldı.");
  
      // 2. HTTP DELETE ilə backend-ə məlumat ötür
      await axios.delete(
        "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/AuctionParticipant/LeaveAuction",
        {
          data: {
            auctionId: parseInt(auctionId),
            userId: parseInt(userId),
          },
        }
      );
  
      // 3. İstifadəçini yönləndir
      navigate("/auctionList");
    } catch (err) {
      console.error("LeaveAuction xətası:", err);
      setMessage("Auction-dan çıxmaq alınmadı.");
    }
  };
  
  

  return (
    <div className="p-4 border border-blue-300 rounded-xl bg-blue-50 text-blue-700 text-sm">
      <h2 className="font-semibold mb-2">Auction-a qoşulanlar:</h2>

      {participantMessages.length > 0 && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-800">Real-time mesajlar:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {participantMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {joined && (
        <button
          onClick={handleLeave}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Auction-dan çıx
        </button>
      )}
    </div>
  );
};

export default JoinChat;
