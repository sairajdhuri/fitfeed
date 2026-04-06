'use client';
import React from 'react';

export default function EnergyStabilityWidget() {
  const bars = [40, 60, 50, 70, 95];
  
  return (
    <div style={{
      backgroundColor: '#F3F4F1',
      borderRadius: '24px',
      padding: '32px 24px',
      marginTop: '48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <span style={{ 
        fontSize: '10px', 
        fontWeight: 600, 
        color: 'var(--brand-rust)', 
        letterSpacing: '1px', 
        textTransform: 'uppercase',
        marginBottom: '16px'
      }}>
        The Curator's Wisdom
      </span>
      
      <h3 className="font-serif" style={{ fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 16px 0', fontWeight: 400 }}>
        Energy Stability
      </h3>
      
      <p style={{ 
        fontSize: '13px', 
        color: 'var(--text-secondary)', 
        lineHeight: 1.6, 
        margin: '0 0 32px 0',
        maxWidth: '280px'
      }}>
        Your higher protein breakfast has successfully flattened your energy curve. You've avoided the typical 3 PM slump today.
      </p>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {bars.map((height, i) => {
          const isLast = i === bars.length - 1;
          return (
            <div 
              key={i} 
              style={{
                width: '32px',
                height: `${height}%`,
                backgroundColor: isLast ? 'var(--brand-olive)' : 'var(--brand-sage)',
                borderRadius: '16px 16px 8px 8px',
                opacity: isLast ? 1 : 0.8
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
