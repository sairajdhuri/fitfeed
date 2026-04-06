'use client';

import React, { useEffect, useState } from 'react';

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: CalorieRingProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const safeTarget = target > 0 ? target : 2000;
  const radius = 100;
  const stroke = 22;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(consumed / safeTarget, 1) * circumference);

  const remaining = Math.max(safeTarget - consumed, 0);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a static placeholder
    return (
      <div className="relative flex justify-center items-center h-[200px] w-[200px] opacity-0" />
    );
  }

  return (
    <div className="relative flex justify-center items-center drop-shadow-2xl">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          stroke="#1f2937" /* gray-800 */
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground fill */}
        <circle
          stroke="#10b981" /* emerald-500 */
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Central Stats */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white tracking-tighter shadow-sm">{remaining}</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Remaining</span>
      </div>
    </div>
  );
}
