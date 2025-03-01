"use client";

import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import Confetti from "react-confetti";

export interface WheelOption {
  label: string;
  odds: number;
}

interface WheelProps {
  options: WheelOption[];
  /** Diameter of the wheel in viewport height (vh) */
  wheelSize?: number;
}

const Wheel: React.FC<WheelProps> = ({ options, wheelSize = 50 }) => {
  const baseColorLeiden = "#001158"; // bg-leiden
  const baseColorScience = "#f46e32"; // bg-science

  // Generate a color palette by interpolating between two base colors
  const sectionColors = chroma
    .scale([baseColorLeiden, baseColorScience])
    .mode("lab")
    .colors(options.length);

  // Spin button distance from bottom (in vh)
  const buttonDistance = wheelSize * 0.2;

  // Pointer dimensions derived from wheelSize
  const pointerSize = wheelSize * 0.06; // triangle height
  const pointerDistance = wheelSize * 0.02; // gap above the wheel

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Spin the wheel
  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const selectedSectionIndex = selectSectionBasedOnOdds();
    console.log("Chosen option:", options[selectedSectionIndex].label);

    const duration = 5; // spin time in seconds
    setAnimationDuration(duration);

    const spins = Math.floor(Math.random() * 3) + 5; // 5–7 full spins
    const sectionAngle = 360 / options.length;
    const selectedSectionAngle =
      selectedSectionIndex * sectionAngle + sectionAngle / 2;

    const currentRotationNormalized = ((rotation % 360) + 360) % 360;
    const angleToRotate =
      spins * 360 +
      ((360 - selectedSectionAngle - currentRotationNormalized) % 360);

    const newRotation = rotation + angleToRotate;
    setRotation(newRotation);

    // Show confetti at the end
    setTimeout(() => {
      setSpinning(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }, duration * 1000);
  };

  // Randomly choose a wedge based on each option's odds
  const selectSectionBasedOnOdds = () => {
    const totalOdds = options.reduce((sum, option) => sum + option.odds, 0);
    const rand = Math.floor(Math.random() * totalOdds) + 1;
    let cumulative = 0;
    for (let i = 0; i < options.length; i++) {
      cumulative += options[i].odds;
      if (rand <= cumulative) {
        return i;
      }
    }
    return options.length - 1;
  };

  // Helper to create an arc path for each wedge
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      `M ${x} ${y}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Spin on pressing "s"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s") {
        spinWheel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, rotation]);

  // For confetti: track window dimensions
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pointerTop = `calc(45% - (${
    wheelSize / 2
  }vh) - ${pointerSize}vh - ${pointerDistance}vh)`;

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-gray-100">
      {/* Confetti effect on spin end */}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <div
        className="pointer absolute"
        style={{
          left: "50%",
          top: pointerTop,
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: `${pointerSize / 2}vh solid transparent`,
          borderRight: `${pointerSize / 2}vh solid transparent`,
          borderTop: `${pointerSize}vh solid ${baseColorLeiden}`,
          zIndex: 10,
        }}
      />

      {/* Wheel Container */}
      <div
        className="absolute"
        style={{
          top: "45%",
          left: "50%",
          width: `${wheelSize}vh`,
          height: `${wheelSize}vh`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full rounded-full border-8 border-black shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${animationDuration}s cubic-bezier(0.33, 1, 0.68, 1)`,
            filter: "hue-rotate(15deg) saturate(1.2)",
            shapeRendering: "geometricPrecision",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Enhanced drop shadow for a deeper 3D effect */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="12"
                floodColor="rgba(0,0,0,0.8)"
              />
            </filter>
            {/* Glossy overlay gradient for a high-end, reflective shine */}
            <radialGradient id="gloss" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <g filter="url(#shadow)">
            {options.map((option, index) => {
              const anglePerSection = 360 / options.length;
              const startAngle = index * anglePerSection;
              const endAngle = startAngle + anglePerSection;
              const rotateText = startAngle + anglePerSection / 2;
              return (
                <g key={index}>
                  <path
                    d={describeArc(500, 500, 500, startAngle, endAngle)}
                    fill={sectionColors[index]}
                    stroke="black"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x="500"
                    y="150"
                    textAnchor="middle"
                    className="font-bold select-none drop-shadow-lg text-3xl"
                    fill="white"
                    fontSize="50"
                    transform={`rotate(${rotateText}, 500, 500)`}
                  >
                    {option.label}
                  </text>
                </g>
              );
            })}
          </g>
          {/* Glossy overlay for added shine */}
          <circle
            cx="500"
            cy="500"
            r="480"
            fill="url(#gloss)"
            style={{ mixBlendMode: "soft-light" }}
          />
        </svg>
      </div>

      {/* Spin Button */}
      <div
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: `${buttonDistance}vh`,
        }}
      >
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="py-4 px-8 text-xl border-2 border-black rounded-full bg-leiden text-white transition-transform duration-300 hover:scale-105 animate-bounce disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
        >
          Spin
        </button>
      </div>
    </section>
  );
};

export default Wheel;
