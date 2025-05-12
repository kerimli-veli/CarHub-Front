import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuctionParticipants from "./AuctionParticipants";
import BidControls from "./BidControls";
import AuctionTimer from "./AuctionTimer";

const JoinChat = ({ auctionId }) => {
  const [participantMessages, setParticipantMessages] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const connectionRef = useRef(null);
  const hasConnected = useRef(false);
  const navigate = useNavigate();
  const [lastBidder, setLastBidder] = useState("");
const [currentPrice, setCurrentPrice] = useState(0);


  const getUserId = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) return null;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  };

  const safeStartConnection = async (connection) => {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
      } catch (err) {
        console.error("SignalR start xətası:", err);
      }
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (!token) return;

    if (!connectionRef.current) {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/auctionHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = conn;
    }

    const connection = connectionRef.current;

    const setup = async () => {
      if (!hasConnected.current) {
        await safeStartConnection(connection);
        hasConnected.current = true;

        connection.off("ParticipantJoined");
        connection.off("ParticipantLeft");
        connection.off("BidPlaced");

        connection.on("ParticipantJoined", (msg) =>
          setParticipantMessages((prev) => [...prev, msg])
        );
        
        connection.on("ParticipantLeft", (msg) =>
          setParticipantMessages((prev) => [...prev, msg])
        );

        connection.on("BidPlaced", (data) => {
          setParticipantMessages((prev) => [
            ...prev,
            `${data.bidder} ${data.newPrice} AZN ilə təklif verdi.`,
          ]);
          setRemainingSeconds(data.remainingSeconds);
        });

        const userId = getUserId();
        if (userId) {
          await connection.invoke("JoinAuction", parseInt(auctionId), parseInt(userId));
          setJoined(true);
        }
      }
    };

    setup();

    return () => {
      if (connection?.state === signalR.HubConnectionState.Connected) {
        connection.stop();
        hasConnected.current = false;
      }
    };
  }, [auctionId]);

  // Timer azaldıcı effekt
  useEffect(() => {
    if (remainingSeconds === null) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const handleBid = async (increment) => {
    const connection = connectionRef.current;
    const userId = getUserId();
    if (!userId || !connection) return;

    try {
      await connection.invoke("PlaceBid", parseInt(auctionId), parseInt(userId), increment);
    } catch (err) {
      console.error("PlaceBid xətası:", err);
    }
  };

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

      <AuctionParticipants messages={participantMessages} />
      <AuctionTimer seconds={remainingSeconds} />

      <div className="mt-4">
        <BidControls onBid={handleBid} />
      </div>

      {joined && (
        <button
          onClick={handleLeave}
          className="absolute bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Leave Auction
        </button>
      )}

      {message && (
        <div className="absolute top-2 right-2 p-2 bg-green-100 text-green-700 rounded-lg text-xs">
          {message}
        </div>
      )}
    </div>
  );
};

export default JoinChat;
