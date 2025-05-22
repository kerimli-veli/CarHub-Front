import React, { useEffect, useState, useRef } from "react";

const MiniAuctionTimer = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [auction, setAuction] = useState(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 360, y: window.innerHeight - 160 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    const storedAuction = localStorage.getItem("activeAuction");
    if (storedAuction) {
      const parsed = JSON.parse(storedAuction);
      setAuction(parsed);
      startCountdown(new Date(parsed.endTime));
    }
  }, []);

  const startCountdown = (endTime) => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        
        localStorage.removeItem("activeAuction");
        setAuction(null);
        return;
      }

      const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
  
    const margin = 15;
    const componentWidth = timerRef.current?.offsetWidth || 250;
    const componentHeight = timerRef.current?.offsetHeight || 160;
  
    const maxX = window.innerWidth - componentWidth - margin;
    const maxY = window.innerHeight - componentHeight - margin;
  
    const newX = Math.max(margin, Math.min(e.clientX - offset.current.x, maxX));
    const newY = Math.max(margin, Math.min(e.clientY - offset.current.y, maxY));
  
    setPosition({ x: newX, y: newY });
  };
  

  const handleMouseUp = () => {
    setDragging(false);
  };
  

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  if (!auction) return null;

  return (
    <div
      ref={timerRef}
      onMouseDown={handleMouseDown}
      className="z-50 cursor-move select-none"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex flex-col items-center">
        {/* Timer */}
        <div className="flex bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-4 py-3 gap-3 shadow-lg backdrop-blur-sm w-fit">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-white w-16"
            >
              <span className="text-lg font-bold">{item.value}</span>
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Continue Auction button */}
        <button
          onClick={() => {
            if (auction) {
              window.location.href = `/CreateAuction/${auction.id}`;
            }
          }}
          className="mt-3 w-full px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md transition-all font-medium"
          style={{ width: "calc(4 * 4rem + 3 * 0.75rem + 2rem)" }}
        >
          Continue Auction
        </button>
      </div>
    </div>
  );
};

export default MiniAuctionTimer;
