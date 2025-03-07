"use client";
import { useState, useEffect, useRef } from "react";

const YouTubeToggle: React.FC = () => {
  const [visible, setVisible] = useState(false);
  // useRef to keep mutable values without triggering re-renders
  const sequenceRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const now = Date.now();
      // Reset sequence if more than 1 second has passed since last key press
      if (now - lastKeyTimeRef.current > 1000) {
        sequenceRef.current = event.key;
      } else {
        sequenceRef.current += event.key;
      }
      lastKeyTimeRef.current = now;

      if (sequenceRef.current === "liacs") {
        setVisible((prev) => !prev);
        sequenceRef.current = ""; // reset sequence after toggle
      }
    };

    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[270px] h-[600px] shadow-lg border border-gray-300 bg-white">
      <iframe
        title="YouTube"
        src="https://www.youtube.com/embed/zZ7AimPACzc?start=120&autoplay=1&mute=1"
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeToggle;
