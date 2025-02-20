"use client";

import React, { useState } from 'react';
import './Wheel.css';

const Wheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);

  const sections = [
    { color: '#033677', label: 'Niks', odds: 300 },    // 30%
    { color: '#ea7c2d', label: 'Opnieuw', odds: 300 }, // 30% 
    { color: '#406896', label: 'Beker', odds: 200 },     // 20%
    { color: '#d38750', label: 'T-Shirt', odds: 200 },     // 20%
  ];

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Select a section based on skewed odds
    const selectedSection = selectSectionBasedOnOdds();

    // Output the chosen option to the console
    console.log('Chosen option:', sections[selectedSection].label);

    // Simulate spin duration
    const duration = 5; // Adjust as needed for excitement
    setAnimationDuration(duration);

    const spins = Math.floor(Math.random() * 3) + 5; // Random spins between 5 and 7
    const sectionAngle = 360 / sections.length;

    // Calculate the angle to rotate to land on the chosen section
    const selectedSectionAngle = selectedSection * sectionAngle + sectionAngle / 2;
    const currentRotationNormalized = (rotation % 360 + 360) % 360;
    const angleToRotate =
      spins * 360 +
      (360 - selectedSectionAngle - currentRotationNormalized) % 360;

    const newRotation = rotation + angleToRotate;
    setRotation(newRotation);

    // Animate the pointer to simulate the clicking effect
    animatePointer(duration, rotation, angleToRotate);

    // After the animation is done, set spinning to false
    setTimeout(() => {
      setSpinning(false);
    }, duration * 1000);
  };

  const selectSectionBasedOnOdds = () => {
    const totalOdds = sections.reduce((sum, section) => sum + section.odds, 0);
    const rand = Math.floor(Math.random() * totalOdds) + 1; // Random integer between 1 and totalOdds
    let cumulative = 0;
    for (let i = 0; i < sections.length; i++) {
      cumulative += sections[i].odds;
      if (rand <= cumulative) {
        return i;
      }
    }
    return sections.length - 1; // Fallback
  };

  const animatePointer = (
    duration: number,
    startRotation: number,
    totalRotation: number
  ) => {
    const pointer = document.querySelector('.arrow') as HTMLElement;
    if (!pointer) return;

    let lastSectionIndex = 0;
    const startTime = performance.now();

    const tick = (time: number) => {
      const elapsed = (time - startTime) / 1000; // In seconds
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentRotation =
        startRotation + totalRotation * easedProgress;

      const sectionAngle = 360 / sections.length;
      const currentRotationNormalized =
        (currentRotation % 360 + 360) % 360;
      const currentSectionIndex = Math.floor(
        (currentRotationNormalized) / sectionAngle
      );

      if (currentSectionIndex !== lastSectionIndex) {
        lastSectionIndex = currentSectionIndex;
        pointer.classList.add('pointer-animate');
        setTimeout(() => {
          pointer.classList.remove('pointer-animate');
        }, 100);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  // Easing function for smooth deceleration
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Function to describe an arc sector
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      `M ${x} ${y}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');

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
    <div className="wheel-container">
      <div className="wheel">
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="100%"
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
                  fill="#ffffff"
                  fontSize="50"
                  transform={`rotate(${rotateText}, 500, 500)`}
                >
                  {section.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="arrow"></div>
      <button onClick={spinWheel} disabled={spinning} className="spin-button">
        Spin
      </button>
    </div>
  );
};

export default Wheel;
