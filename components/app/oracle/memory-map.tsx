'use client';

import { useMemo } from 'react';

export interface MemoryNode {
  id: string;
  label: string;
  role: 'user' | 'assistant';
  summary: string;
  strength: number;
}

interface MemoryMapProps {
  nodes: MemoryNode[];
}

const ROLE_COLORS: Record<MemoryNode['role'], string> = {
  user: '#1e1b4b',
  assistant: '#0b7285',
};

export function MemoryMap({ nodes }: MemoryMapProps) {
  const layout = useMemo(() => {
    if (!nodes.length) return [];
    const center = { x: 180, y: 180 };
    const maxRadius = 140;
    const minRadius = 70;
    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = minRadius + node.strength * (maxRadius - minRadius);
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      return {
        node,
        x,
        y,
        angle,
      };
    });
  }, [nodes]);

  return (
    <div className="relative h-[360px] w-[360px]">
      <svg className="absolute inset-0" viewBox="0 0 360 360" aria-hidden>
        <defs>
          <radialGradient id="memory-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="180" r="64" fill="url(#memory-center)" />
        {layout.map(({ node, x, y }) => (
          <line
            key={`edge-${node.id}`}
            x1="180"
            y1="180"
            x2={x}
            y2={y}
            stroke={ROLE_COLORS[node.role] + '55'}
            strokeWidth={1.5}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-leiden/40 bg-white/80 text-center shadow-lg">
        <span className="text-xs font-semibold uppercase tracking-wide text-leiden">Oracle</span>
        <span className="text-[10px] text-muted-foreground">Memory Core</span>
      </div>

      {layout.map(({ node, x, y }) => (
        <div
          key={node.id}
          className="absolute flex max-w-[140px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-center shadow-md backdrop-blur"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            opacity: Math.max(0.35, node.strength),
            transform: `translate(-50%, -50%) scale(${0.8 + node.strength * 0.4})`,
          }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: ROLE_COLORS[node.role] }}
          >
            {node.label}
          </span>
          <span className="text-[11px] leading-tight text-slate-600">{node.summary}</span>
        </div>
      ))}
    </div>
  );
}
