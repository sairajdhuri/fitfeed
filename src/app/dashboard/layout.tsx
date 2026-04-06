import React from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container">
      <Header />
      <main style={{ paddingBottom: '96px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
