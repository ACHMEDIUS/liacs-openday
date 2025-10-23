import { SquareTerminal } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <SquareTerminal size={24} className="text-emerald-400" />
    </div>
  );
}
