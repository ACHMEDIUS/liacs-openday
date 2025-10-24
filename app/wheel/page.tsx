'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileUnsupportedNotice } from '@/components/common/MobileNotice';

interface WheelSettings {
  items: string[];
  colors: string[];
  spinDuration: number;
  autoSpin: boolean;
  soundEnabled: boolean;
  confettiEnabled: boolean;
}

const defaultWheelSettings: WheelSettings = {
  items: [],
  colors: [],
  spinDuration: 3000,
  autoSpin: false,
  soundEnabled: false,
  confettiEnabled: true,
};

const SPIN_DURATION = 3200;

export default function WheelPage() {
  // Removed authentication requirement - wheel is now publicly accessible
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelSettings, setWheelSettings] = useState<WheelSettings>(defaultWheelSettings);
  const [canSpin, setCanSpin] = useState(true);
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('wheelSettings');
    if (savedSettings) {
      setWheelSettings(JSON.parse(savedSettings));
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    if (!wheelSettings.confettiEnabled) return;

    // Multiple bursts of confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, [wheelSettings.confettiEnabled]);

  const spinWheel = useCallback(() => {
    if (isSpinning || !canSpin) return;
    if (wheelSettings.items.length === 0) return;

    setIsSpinning(true);
    setCanSpin(false);

    // Calculate multiple full rotations plus random final position
    const baseRotations = 5;
    const extraRotations = Math.random() * 0.5;
    const finalPosition = Math.random() * 360; // Final stopping position
    const totalRotation = (baseRotations + extraRotations) * 360 + finalPosition;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);

      triggerConfetti();

      // Allow spinning again after a short delay
      setTimeout(() => setCanSpin(true), 2000);
    }, SPIN_DURATION);
  }, [isSpinning, canSpin, rotation, wheelSettings, triggerConfetti]);

  // Auto-spin if enabled
  useEffect(() => {
    if (wheelSettings.autoSpin && canSpin) {
      const timer = setTimeout(() => {
        spinWheel();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [wheelSettings.autoSpin, canSpin, spinWheel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 's' && canSpin && !isSpinning) {
        spinWheel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canSpin, isSpinning, spinWheel]);

  const resetWheel = () => {
    setRotation(0);
    setCanSpin(true);
  };

  // Wheel is now publicly accessible - no authentication checks needed

  if (!ready) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <MobileUnsupportedNotice
          title="Wheel of Fortune"
          description="The Wheel of Fortune experience is not available on mobile devices. Please switch to a tablet or desktop to spin the wheel."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 flex items-center justify-center gap-2 text-4xl font-bold text-leiden">
          <Sparkles className="h-8 w-8" />
          Wheel of Fortune
          <Sparkles className="h-8 w-8" />
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Spin the wheel to celebrate with the crowd.
        </p>

        {wheelSettings.items.length === 0 ? (
          <p className="mb-10 text-sm text-muted-foreground">
            Add prizes in the admin panel to get the wheel ready.
          </p>
        ) : null}

        {/* Wheel Container - Much Larger */}
        <div className="relative mx-auto mb-8 h-[500px] w-[500px] md:h-[600px] md:w-[600px]">
          {/* Pointer */}
          <div className="absolute left-1/2 top-0 z-20 h-8 w-8 -translate-x-1/2 transform">
            <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
          </div>

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl"></div>

          {/* Wheel */}
          <div
            className={`relative h-full w-full rounded-full border-4 border-gray-800 shadow-2xl transition-transform ease-out ${
              isSpinning ? 'animate-pulse' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? `${SPIN_DURATION}ms` : '500ms',
              background:
                wheelSettings.items.length > 0
                  ? `conic-gradient(${wheelSettings.items
                      .map((_, index) => {
                        const startAngle = (index * 360) / wheelSettings.items.length;
                        const endAngle = ((index + 1) * 360) / wheelSettings.items.length;
                        const color = wheelSettings.colors[index] || '#001158';
                        return `${color} ${startAngle}deg ${endAngle}deg`;
                      })
                      .join(', ')})`
                  : 'radial-gradient(circle at center, rgba(15,23,42,0.95), rgba(30,41,59,0.85))',
            }}
          >
            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-leiden shadow-lg"></div>

            {/* Wheel Items */}
            {wheelSettings.items.map((item, index) => {
              const angle = (index * 360) / wheelSettings.items.length;
              const midAngle = angle + 180 / wheelSettings.items.length;
              const radius = 200; // Distance from center

              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 origin-bottom text-sm font-bold text-white drop-shadow-lg md:text-base"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${midAngle}deg) translateY(-${radius}px)`,
                    width: '120px',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  <div className="rounded bg-black/20 px-2 py-1">{item}</div>
                </div>
              );
            })}
          </div>

          {/* Spinning Effect Overlay */}
          {isSpinning && (
            <div className="pointer-events-none absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={spinWheel}
            disabled={isSpinning || !canSpin || wheelSettings.items.length === 0}
            className="bg-leiden px-8 py-4 text-lg hover:bg-leiden/90"
            size="lg"
          >
            {isSpinning ? (
              'Spinning...'
            ) : !canSpin ? (
              'Wait...'
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Spin the Wheel!
              </>
            )}
          </Button>

          <Button
            onClick={resetWheel}
            variant="outline"
            size="lg"
            disabled={isSpinning || wheelSettings.items.length === 0}
            className="px-6 py-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
