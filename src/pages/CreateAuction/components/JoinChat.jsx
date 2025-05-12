import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const JoinChat = ({ auctionId }) => {
  const [participantMessages, setParticipantMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);

  const connectionRef = useRef(null);
  const hasConnected = useRef(false);
  const messagesEndRef = useRef(null);

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

  const safeStartConnection = async (connection) => {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
        console.log("SignalR connection started");
      } catch (err) {
        console.error("SignalR bağlantı xətası (safeStartConnection):", err);
      }
    } else {
      console.warn("Start çağırılmadı. Mövcud vəziyyət:", connection.state);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) return;

    if (!connectionRef.current) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/auctionHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;
    }

    const connection = connectionRef.current;

    const setupConnection = async () => {
      if (!hasConnected.current) {
        await safeStartConnection(connection);
        hasConnected.current = true;

        connection.off("ParticipantJoined");
        connection.off("ParticipantLeft");

        connection.on("ParticipantJoined", (msg) => {
          setParticipantMessages((prev) => [...prev, msg]);
        });

        connection.on("ParticipantLeft", (msg) => {
          setParticipantMessages((prev) => [...prev, msg]);
        });

        const userId = getUserId();
        if (userId) {
          try {
            await connection.invoke("JoinAuction", parseInt(auctionId), parseInt(userId));
            setJoined(true);
          } catch (err) {
            console.error("JoinAuction invoke xətası:", err);
          }
        }
      }
    };

    setupConnection();

    return () => {
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        connection.stop();
        console.log("Unmount zamanı bağlantı dayandırıldı.");
        hasConnected.current = false;
      }
    };
  }, [auctionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [participantMessages]);

  const handleLeave = async () => {
    const connection = connectionRef.current;
    const userId = getUserId();
    if (!userId || !connection) return;

    try {
      await connection.invoke("LeaveAuction", parseInt(auctionId), parseInt(userId));
      setJoined(false);
      setMessage("Auction-dan çıxıldı.");

      await axios.delete(
        "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/AuctionParticipant/LeaveAuction",
        {
          data: {
            auctionId: parseInt(auctionId),
            userId: parseInt(userId),
          },
        }
      );

      await connection.stop();
      hasConnected.current = false;

      navigate("/auctionList");
      window.location.reload();
    } catch (err) {
      console.error("LeaveAuction xətası:", err);
      setMessage("Auction-dan çıxmaq alınmadı.");
    }
  };

  return (
    <div className="relative p-4 border border-gray-100 rounded-xl bg-white text-sm h-[97%]">
      <h2 className="font-semibold mb-2 text-blue-700">Auction-a qoşulanlar:</h2>

      <div className="overflow-y-auto h-[230px] pr-2">
        {participantMessages.length > 0 && (
          <ul className="list-disc list-inside space-y-1">
            {participantMessages.map((msg, index) => {
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
                className={`relative pl-6 ${textColor} list-none left-0 top-1 h-5 bg-no-repeat bg-contain`} // list-none default bullet-i ləğv edir
                style={{ backgroundImage: "url('https://i.postimg.cc/bwffRW8k/Screenshot-2025-05-12-151133.png')" }}
              >
                {msg}
              </li>
              

              );
            })}
            <div ref={messagesEndRef} />
          </ul>
        )}
      </div>

      {message && (
        <div className="absolute top-2 right-2 p-2 bg-green-100 text-green-700 rounded-lg text-xs">
          {message}
        </div>
      )}

      {joined && (
        <button
          onClick={handleLeave}
          className="absolute bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Leave Auction
        </button>
      )}
    </div>
  );
};

export default JoinChat;
