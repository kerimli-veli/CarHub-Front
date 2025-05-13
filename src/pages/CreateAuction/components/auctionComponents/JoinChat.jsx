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
  const [topBidder, setTopBidder] = useState(null);


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
        console.error("SignalR start error:", err);
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
        .withUrl("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/auctionHub", {
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
        
        connection.on("ParticipantJoined", (msg) => {
          setParticipantMessages((prev) => {
            if (prev[prev.length - 1] === msg) return prev;
            return [...prev, msg];
          });
        });

        connection.on("InitialAuctionState", (data) => {
        if (data?.topBidder && data?.price) {
            setTopBidder({ name: data.topBidder, price: data.price });
          }
        });
        
        connection.on("ParticipantLeft", (msg) =>
          setParticipantMessages((prev) => [...prev, msg])
        );

        connection.on("BidPlaced", (data) => {
          setParticipantMessages((prev) => [
            ...prev,
            `${data.bidder} placed a bid of ${data.newPrice} AZN.`,
          ]);
          setRemainingSeconds(data.remainingSeconds);
          setTopBidder({ name: data.bidder, price: data.newPrice });

        });

        
        connection.on("AuctionEnded", async (data) => {
        const winnerMsg = `🎉 Təbriklər ${data.winner}, maşını qazandınız! Son təklif: ${data.finalPrice} AZN`;
        setParticipantMessages((prev) => [...prev, winnerMsg]);
        setRemainingSeconds(0);
        setMessage("⚡ Auction bitdi! Sizi yönləndiririk...");

        //  try {
        //   await axios.delete(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/DeleteAuction?id=${auctionId}`);
        // } catch (err) {
        //   console.error("Auction silinərkən xəta baş verdi:", err);
        // }

        // setTimeout(() => {
        //   navigate("/auctionList");
        //   window.location.reload();
        // }, 2000);
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
      console.error("PlaceBid error:", err);
    }
  };

  const handleLeave = async () => {
    const connection = connectionRef.current;
    const userId = getUserId();
    if (!userId || !connection) return;

    try {
      await connection.invoke("LeaveAuction", parseInt(auctionId), parseInt(userId));
      setJoined(false);
      setMessage("Left the auction.");

      await axios.delete(
        "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/AuctionParticipant/LeaveAuction",
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
      console.error("LeaveAuction error:", err);
      setMessage("Failed to leave the auction.");
    }
  };

  return (
    <div className="relative p-4 border border-gray-100 rounded-xl bg-white text-sm h-[70%]">
      <h2 className="font-semibold mb-2 text-gray-500 text-end">Auction Participants</h2>

      <div className="mt-[5%]">
        <AuctionParticipants messages={participantMessages} />
      </div>
      

      {joined && (
        <button
          onClick={handleLeave}
          className="absolute bottom-8 left-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Leave Auction
        </button>
      )}


      <AuctionTimer seconds={remainingSeconds} />
      {topBidder && (
      <div className="absolute top-3 z-10 bg-white text-gray-800 border border-gray-300 px-5 py-2 rounded-lg shadow-md text-sm font-medium animate-pulse">
       ⌛ Last offer: <span className="font-semibold">{topBidder.name}</span> — {topBidder.price} AZN
      </div>
)}
      <div className="mt-4">
        <BidControls onBid={handleBid} />
      </div>

      {message && (
        <div className="absolute top-2 right-2 p-2 bg-green-100 text-green-700 rounded-lg text-xs">
          {message}
        </div>
      )}
    </div>
  );
};

export default JoinChat;
