'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WheelSettings {
  items: string[];
  colors: string[];
  spinDuration: number;
  autoSpin: boolean;
  soundEnabled: boolean;
  confettiEnabled: boolean;
}

const defaultWheelSettings: WheelSettings = {
  items: [
    'LIACS Hoodie',
    'LIACS T-Shirt',
    'Computer Science Book',
    'Programming Stickers',
    'University Pen Set',
    'LIACS Mug',
    'Tech Conference Ticket',
    'Programming Tutorial Access',
  ],
  colors: ['#001158', '#f46e32', '#003366', '#ff6b35', '#004080', '#e55a2b', '#002244', '#d4481f'],
  spinDuration: 3000,
  autoSpin: false,
  soundEnabled: true,
  confettiEnabled: true,
};

export default function WheelPage() {
  // Removed authentication requirement - wheel is now publicly accessible
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [wheelSettings, setWheelSettings] = useState<WheelSettings>(defaultWheelSettings);
  const [canSpin, setCanSpin] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('wheelSettings');
    if (savedSettings) {
      setWheelSettings(JSON.parse(savedSettings));
    }
  }, []);

  const playSpinSound = useCallback(() => {
    if (!wheelSettings.soundEnabled) return;

    // Create a simple beep sound
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [wheelSettings.soundEnabled]);

  const playWinSound = useCallback(() => {
    if (!wheelSettings.soundEnabled) return;

    // Create a celebration sound
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    [523, 659, 784, 1047].forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + index * 0.1 + 0.2
      );

      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + index * 0.1 + 0.2);
    });
  }, [wheelSettings.soundEnabled]);

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

    setIsSpinning(true);
    setResult(null);
    setCanSpin(false);

    playSpinSound();

    // Calculate multiple full rotations plus random final position
    const baseRotations = 5; // Always do at least 5 full rotations
    const extraRotations = Math.random() * 3; // Add 0-3 more rotations
    const finalPosition = Math.random() * 360; // Final stopping position
    const totalRotation = (baseRotations + extraRotations) * 360 + finalPosition;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);

    // Calculate which item was selected
    const itemAngle = 360 / wheelSettings.items.length;
    const normalizedRotation = finalRotation % 360;
    const adjustedRotation = (360 - normalizedRotation + 90) % 360; // Adjust for pointer position
    const selectedIndex = Math.floor(adjustedRotation / itemAngle) % wheelSettings.items.length;

    setTimeout(() => {
      setResult(wheelSettings.items[selectedIndex]);
      setIsSpinning(false);

      playWinSound();
      triggerConfetti();

      // Allow spinning again after a short delay
      setTimeout(() => setCanSpin(true), 2000);
    }, wheelSettings.spinDuration);
  }, [isSpinning, canSpin, rotation, wheelSettings, playSpinSound, playWinSound, triggerConfetti]);

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
    setResult(null);
    setCanSpin(true);
  };

  // Wheel is now publicly accessible - no authentication checks needed

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 flex items-center justify-center gap-2 text-4xl font-bold text-leiden">
          <Sparkles className="h-8 w-8" />
          Wheel of Fortune
          <Sparkles className="h-8 w-8" />
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Spin the wheel to win amazing LIACS prizes!
        </p>

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
              transitionDuration: isSpinning ? `${wheelSettings.spinDuration}ms` : '500ms',
              background: `conic-gradient(${wheelSettings.items
                .map((_, index) => {
                  const startAngle = (index * 360) / wheelSettings.items.length;
                  const endAngle = ((index + 1) * 360) / wheelSettings.items.length;
                  const color = wheelSettings.colors[index] || '#001158';
                  return `${color} ${startAngle}deg ${endAngle}deg`;
                })
                .join(', ')})`,
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
            disabled={isSpinning || !canSpin}
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
            disabled={isSpinning}
            className="px-6 py-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Spin Status */}
        {isSpinning && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 text-leiden">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-lg font-semibold">The wheel is spinning...</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-leiden transition-all duration-1000"
                style={{
                  width: `${((wheelSettings.spinDuration - (Date.now() % wheelSettings.spinDuration)) / wheelSettings.spinDuration) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <Card className="mx-auto mt-8 max-w-lg border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-800">
                <Sparkles className="h-8 w-8 text-yellow-500" />
                🎉 WINNER! 🎉
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4 text-6xl">🏆</div>
              <p className="mb-2 text-2xl font-bold text-orange-700">You won:</p>
              <p className="mb-4 text-3xl font-black text-leiden">{result}</p>
              <p className="rounded-lg bg-white/50 p-3 text-lg text-orange-600">
                🎪 Please visit the LIACS booth to claim your amazing prize! 🎪
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mx-auto mt-8 max-w-2xl">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-center text-xl font-semibold">How to Play:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leiden text-xs font-bold text-white">
                    1
                  </span>
                  Click &quot;Spin the Wheel&quot; to start
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leiden text-xs font-bold text-white">
                    2
                  </span>
                  Watch the wheel spin for {wheelSettings.spinDuration / 1000} seconds
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leiden text-xs font-bold text-white">
                    3
                  </span>
                  See what amazing prize you&apos;ve won!
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-science text-xs font-bold text-white">
                    ⌨
                  </span>
                  Press &apos;S&apos; on your keyboard to spin
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-science text-xs font-bold text-white">
                    🔊
                  </span>
                  {wheelSettings.soundEnabled ? 'Sound effects enabled' : 'Sound effects disabled'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-science text-xs font-bold text-white">
                    🎊
                  </span>
                  {wheelSettings.confettiEnabled
                    ? 'Confetti celebration enabled'
                    : 'Confetti disabled'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
