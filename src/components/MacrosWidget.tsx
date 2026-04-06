'use client';
import React from 'react';

interface MacroBarProps {
  label: string;
  value: string;
  color: string;
  percent: number;
}

const MacroBar = ({ label, value, color, percent }: MacroBarProps) => (
  <div style={{ flex: '1 1 40%', minWidth: '120px' }}>
    <div className="flex-between" style={{ marginBottom: '6px' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
    </div>
    <div style={{ height: '4px', borderRadius: '2px', backgroundColor: '#EAEAEA', width: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', backgroundColor: color, borderRadius: '2px', width: `${percent}%` }} />
    </div>
  </div>
);

export default function MacrosWidget() {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '24px 32px', 
      padding: '0 32px',
      marginTop: '40px'
    }}>
      <MacroBar label="Carbs" value="142g" color="var(--brand-olive)" percent={45} />
      <MacroBar label="Protein" value="88g" color="var(--brand-rust)" percent={60} />
      <MacroBar label="Fats" value="54g" color="var(--brand-taupe)" percent={30} />
      <MacroBar label="Fiber" value="22g" color="var(--brand-sage)" percent={70} />
    </div>
  );
}
