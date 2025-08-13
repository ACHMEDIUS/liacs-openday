'use client';

export default function SimpleGradientBackground() {
  return (
    <div
      className="fixed inset-0 h-screen w-screen"
      style={{
        background: `radial-gradient(circle at center, #f46e32 0%, #e55a1f 60%, #d4501a 100%)`,
        zIndex: 1,
      }}
    />
  );
}
