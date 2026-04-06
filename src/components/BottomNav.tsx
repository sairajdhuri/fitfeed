'use client';
import { Home, Grid, Activity, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: <Home size={24} />, path: '/dashboard' },
    { icon: <Grid size={24} />, path: '/library' },
    { icon: <Activity size={24} />, path: '/analytics' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: '432px',
      backgroundColor: 'var(--white)',
      borderRadius: '40px',
      boxShadow: 'var(--shadow-soft)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 50
    }}>
      {navItems.map((item, idx) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: isActive ? 'var(--brand-olive)' : '#C4C4C4',
              transition: 'color 0.2s',
              padding: '12px'
            }}
          >
            {item.icon}
          </button>
        )
      })}
      
      {/* Floating Add Button within nav */}
      <button 
        onClick={() => router.push('/log-meal')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: 'var(--brand-olive)',
          color: 'var(--white)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(76, 101, 68, 0.3)'
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
