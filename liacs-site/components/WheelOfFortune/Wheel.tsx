"use client";

import React, { useState } from "react";
import "./Wheel.css";

const Wheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);

  const sections = [
    { color: "#033677", label: "Niks", odds: 300 },
    { color: "#ea7c2d", label: "Opnieuw", odds: 300 },
    { color: "#406896", label: "Beker", odds: 200 },
    { color: "#d38750", label: "T-Shirt", odds: 200 },
  ];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const selectedSection = selectSectionBasedOnOdds();
    console.log("Chosen option:", sections[selectedSection].label);

    const duration = 5;
    setAnimationDuration(duration);

    const spins = Math.floor(Math.random() * 3) + 5; // between 5 and 7 spins
    const sectionAngle = 360 / sections.length;
    const selectedSectionAngle = selectedSection * sectionAngle + sectionAngle / 2;
    const currentRotationNormalized = ((rotation % 360) + 360) % 360;
    const angleToRotate =
      spins * 360 +
      (360 - selectedSectionAngle - currentRotationNormalized) % 360;
    const newRotation = rotation + angleToRotate;
    setRotation(newRotation);

    animatePointer(duration, rotation, angleToRotate);

    setTimeout(() => {
      setSpinning(false);
    }, duration * 1000);
  };

  const selectSectionBasedOnOdds = () => {
    const totalOdds = sections.reduce((sum, section) => sum + section.odds, 0);
    const rand = Math.floor(Math.random() * totalOdds) + 1;
    let cumulative = 0;
    for (let i = 0; i < sections.length; i++) {
      cumulative += sections[i].odds;
      if (rand <= cumulative) {
        return i;
      }
    }
    return sections.length - 1;
  };

  const animatePointer = (
    duration: number,
    startRotation: number,
    totalRotation: number
  ) => {
    const pointer = document.querySelector(".arrow") as HTMLElement;
    if (!pointer) return;

    let lastSectionIndex = 0;
    const startTime = performance.now();

    const tick = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentRotation = startRotation + totalRotation * easedProgress;
      const sectionAngle = 360 / sections.length;
      const currentRotationNormalized = ((currentRotation % 360) + 360) % 360;
      const currentSectionIndex = Math.floor(currentRotationNormalized / sectionAngle);
      if (currentSectionIndex !== lastSectionIndex) {
        lastSectionIndex = currentSectionIndex;
        pointer.classList.add("pointer-animate");
        setTimeout(() => {
          pointer.classList.remove("pointer-animate");
        }, 100);
      }
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const d = [
      `M ${x} ${y}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
    return d;
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

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Wheel */}
      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${animationDuration}s cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
        >
          {sections.map((section, index) => {
            const anglePerSection = 360 / sections.length;
            const startAngle = index * anglePerSection;
            const endAngle = startAngle + anglePerSection;
            const rotateText = startAngle + anglePerSection / 2;
            return (
              <g key={index}>
                <path
                  d={describeArc(500, 500, 500, startAngle, endAngle)}
                  fill={section.color}
                />
                <text
                  x="500"
                  y="150"
                  textAnchor="middle"
                  fill="#000"
                  fontSize="50"
                  transform={`rotate(${rotateText}, 500, 500)`}
                >
                  {section.label}
                </text>
              </g>
            );
          })}
        </svg>
      </section>
      {/* Arrow */}
      <section className="arrow"></section>
      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 py-4 px-8 text-xl border-2 border-black rounded-full bg-gray-300 text-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Spin
      </button>
    </section>
  );
};

export default Wheel;
