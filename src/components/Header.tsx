'use client';
import { Menu } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  avatarSrc?: string;
}

export default function Header({ title = "FitFeed", avatarSrc = "/avatar_profile_1775500869854.png" }: HeaderProps) {
  return (
    <header className="flex-between" style={{ padding: '24px', paddingTop: '48px', backgroundColor: 'transparent' }}>
      <button aria-label="Menu" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
        <Menu size={24} color="var(--brand-olive)" />
      </button>
      
      <h1 className="font-serif" style={{ fontSize: '20px', fontStyle: 'italic', color: 'var(--brand-olive)', margin: 0, fontWeight: 500 }}>
        {title}
      </h1>
      
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e2e2e2', border: '1px solid var(--brand-sage)' }}>
        {avatarSrc && <Image src={avatarSrc} alt="Avatar" width={40} height={40} style={{ objectFit: 'cover' }} />}
      </div>
    </header>
  );
}
