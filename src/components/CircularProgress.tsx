'use client';
import React from 'react';

interface CircularProgressProps {
  value: number; // e.g. 1350
  max: number; // e.g. 2000
  label?: string;
}

export default function CircularProgress({ value, max, label = "KCAL REMAINING" }: CircularProgressProps) {
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Percent complete (the green track)
  const percentComplete = ((max - value) / max); 
  // Wait, if it says '1350 remaining', the green is what's used? 
  // Usually, the solid dark track is the consumed amount, and the light background track is the total.
  // In the design, it shows a thick green track taking up about 35% of the circle, meaning 65% left.
  const dashoffset = circumference - percentComplete * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track (peach / beige) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E6DFD4" /* Beige track */
          strokeWidth={strokeWidth}
        />
        {/* Progress Track (dark olive) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-olive)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      
      {/* Inner Content */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <span style={{ fontSize: '42px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-1px' }}>
          {value.toLocaleString()}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
