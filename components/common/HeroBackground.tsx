'use client';

export default function SimpleGradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.85)_0%,_rgba(76,29,149,0.85)_45%,_rgba(15,23,42,0.95)_100%)] opacity-90" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(192, 132, 252, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(192, 132, 252, 0.18) 1px, transparent 1px)',
          backgroundSize: '140px 140px',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(217,180,254,0.35),_transparent_55%),radial-gradient(circle_at_80%_15%,_rgba(147,51,234,0.3),_transparent_55%)] opacity-60 mix-blend-screen" />
    </div>
  );
}
