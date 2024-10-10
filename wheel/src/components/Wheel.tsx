import React, { useState, useEffect } from 'react';
import './Wheel.css';

const Wheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);

  const sections = [
    { color: '#e74c3c', label: 'Niks', odds: 69 },   // Red
    { color: '#3498db', label: 'Opnieuw', odds: 25 },   // Blue
    { color: '#2ecc71', label: 'Pen', odds: 5 },    // Green
    { color: '#f1c40f', label: 'Beker', odds: 0.5 },  // Yellow
    { color: '#9b59b6', label: 'Tasje', odds: 0.5 },  // Purple
  ];

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Generate random duration between 4.5 and 5.2 seconds
    const duration = 4.5 + Math.random() * (5.2 - 4.5);
    setAnimationDuration(duration);

    // Select a section based on skewed odds
    const selectedSection = selectSectionBasedOnOdds();

    // Each section is 72 degrees (360 / 5)
    const sectionAngle = 360 / sections.length;

    // Calculate the target rotation
    const spins = 5; // Number of spins before slowing down
    const randomAngleWithinSection = Math.random() * sectionAngle;
    const totalRotation =
      spins * 360 +
      selectedSection * sectionAngle +
      randomAngleWithinSection;

    const newRotation = rotation + totalRotation;

    setRotation(newRotation);

    // Animate the pointer to simulate the clicking effect
    animatePointer(duration, rotation, totalRotation);

    // After the animation is done, set spinning to false
    setTimeout(() => {
      setSpinning(false);
    }, duration * 1000);
  };

  const selectSectionBasedOnOdds = () => {
    const totalOdds = sections.reduce((sum, section) => sum + section.odds, 0);
    const rand = Math.random() * totalOdds;
    let cumulative = 0;
    for (let i = 0; i < sections.length; i++) {
      cumulative += sections[i].odds;
      if (rand < cumulative) {
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

    const totalSectionsPassed = Math.floor(
      totalRotation / (360 / sections.length)
    );

    let clickCount = 0;
    let lastTime = 0;
    const startTime = performance.now();

    const tick = (time: number) => {
      const elapsed = (time - startTime) / 1000; // in seconds
      const progress = Math.min(elapsed / duration, 1);
      const currentRotation =
        startRotation + totalRotation * easeOutCubic(progress);

      const sectionsPassed = Math.floor(
        (currentRotation % 360) / (360 / sections.length)
      );

      if (sectionsPassed > clickCount) {
        clickCount = sectionsPassed;
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
                  y="100"
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
