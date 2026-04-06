'use client';
import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import CircularProgress from '../../components/CircularProgress';
import MacrosWidget from '../../components/MacrosWidget';
import EnergyStabilityWidget from '../../components/EnergyStabilityWidget';

interface JournalEntryProps {
  timeLabel: string;
  title: string;
  kcal: string | null;
  imageSrc?: string;
  isBlank?: boolean;
}

const JournalEntry = ({ timeLabel, title, kcal, imageSrc, isBlank }: JournalEntryProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px'
  }}>
    <div style={{
      width: '100px',
      height: '100px',
      borderRadius: '20px',
      backgroundColor: 'var(--white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-soft)',
      border: isBlank ? '1px dashed #C4C4C4' : 'none',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {imageSrc && <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover' }} />}
      {isBlank && <Plus size={24} color="#A8A8A8" />}
    </div>
    
    <div>
      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand-rust)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {timeLabel}
      </span>
      <h4 className="font-serif" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '4px 0 6px 0', fontWeight: 400 }}>
        {title}
      </h4>
      <span style={{ fontSize: '13px', color: isBlank ? 'var(--text-muted)' : 'var(--text-secondary)', fontStyle: isBlank ? 'italic' : 'normal' }}>
        {kcal ? `${kcal} Kcal` : 'Log meal details'}
      </span>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div style={{ padding: '0 24px' }}>
      
      {/* Greeting */}
      <section style={{ textAlign: 'center', margin: '32px 0 48px 0' }}>
        <h2 className="font-serif" style={{ fontSize: '32px', color: 'var(--brand-olive)', margin: '0 0 12px 0', fontStyle: 'italic', fontWeight: 400 }}>
          Morning, Sai
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Your canvas of nourishment is 65%<br/>complete.
        </p>
      </section>

      {/* Progress Circle */}
      <section>
        <CircularProgress value={1350} max={2000} label="KCAL REMAINING" />
      </section>

      {/* Macros */}
      <MacrosWidget />

      {/* Daily Journal */}
      <section style={{ marginTop: '56px' }}>
        <div className="flex-between" style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA' }}>
          <h3 className="font-serif" style={{ fontSize: '22px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
            Daily Journal
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            Oct 22, Sunday
          </span>
        </div>

        <div>
          <JournalEntry timeLabel="MORNING" title="Breakfast" kcal="420" imageSrc="/breakfast_toast_juice_1775500835529.png" />
          <JournalEntry timeLabel="MIDDAY" title="Lunch" kcal="650" imageSrc="/lunch_burger_salad_1775500852681.png" />
          <JournalEntry timeLabel="UPCOMING" title="Dinner" kcal={null} isBlank={true} />
        </div>
      </section>

      {/* Energy Widget */}
      <EnergyStabilityWidget />

    </div>
  );
}
