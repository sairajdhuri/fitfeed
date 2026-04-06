'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, ScanBarcode } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

interface FoodItemProps {
  imageSrc: string;
  title: string;
  portion: string;
  kcal: number;
}

const FoodItem = ({ imageSrc, title, portion, kcal }: FoodItemProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--white)',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-soft)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
        <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div>
        <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: 600 }}>{title}</h4>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{portion}</span>
      </div>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span className="font-serif" style={{ fontSize: '16px', color: 'var(--brand-olive)', fontWeight: 600, fontStyle: 'italic' }}>
        {kcal} kcal
      </span>
      <button style={{
        width: '24px', height: '24px', borderRadius: '12px',
        backgroundColor: 'var(--brand-rust)', color: 'var(--white)',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer'
      }}>
        <Plus size={16} />
      </button>
    </div>
  </div>
);

export default function LogMeal() {
  const router = useRouter();
  
  return (
    <div className="page-container" style={{ padding: '0 24px', position: 'relative' }}>
      
      {/* Header */}
      <header className="flex-between" style={{ paddingTop: '48px', marginBottom: '24px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} color="var(--brand-olive)" />
        </button>
        <h1 className="font-serif" style={{ fontSize: '20px', fontStyle: 'italic', color: 'var(--brand-olive)', margin: 0, fontWeight: 500 }}>
          Log Meal
        </h1>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e2e2e2' }}>
          <Image src="/avatar_profile_1775500869854.png" alt="Avatar" width={36} height={36} style={{ objectFit: 'cover' }} />
        </div>
      </header>

      {/* Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', 
        backgroundColor: '#F3F4F1', borderRadius: '24px', padding: '12px 16px',
        marginBottom: '24px'
      }}>
        <Search size={20} color="#B4B4B4" />
        <input 
          type="text" 
          placeholder="Search foods or brands..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--text-primary)' }} 
        />
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button style={{ padding: '8px 24px', borderRadius: '20px', backgroundColor: 'var(--brand-olive)', color: 'var(--white)', border: 'none', fontSize: '13px', fontWeight: 500 }}>
          Recent
        </button>
        <button style={{ padding: '8px 24px', borderRadius: '20px', backgroundColor: '#F3F4F1', color: 'var(--text-secondary)', border: 'none', fontSize: '13px' }}>
          Favorites
        </button>
        <button style={{ padding: '8px 24px', borderRadius: '20px', backgroundColor: '#F3F4F1', color: 'var(--text-secondary)', border: 'none', fontSize: '13px' }}>
          Common
        </button>
      </div>

      <h3 className="font-serif" style={{ fontSize: '16px', color: 'var(--brand-olive)', fontStyle: 'italic', marginBottom: '16px', fontWeight: 500 }}>
        Frequently Logged
      </h3>

      {/* Food List */}
      <div>
        <FoodItem title="Sourdough Avocado Toast" portion="1 portion (145g)" kcal={285} imageSrc="/avocado_toast_1775501032189.png" />
        <FoodItem title="Artisan Black Coffee" portion="Medium cup (350ml)" kcal={5} imageSrc="/black_coffee_1775501051319.png" />
        <FoodItem title="Greek Yogurt & Honey" portion="1 bowl (200g)" kcal={190} imageSrc="/greek_yogurt_1775501068033.png" />
      </div>

      {/* Quick Log Recommendation Widget */}
      <div style={{
        marginTop: '24px', marginBottom: '24px',
        backgroundColor: '#F3F4F1', borderRadius: '24px', 
        padding: '24px', position: 'relative', overflow: 'hidden'
      }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-rust)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
          QUICK LOG RECOMMENDATION
        </span>
        <h4 className="font-serif" style={{ fontSize: '18px', color: 'var(--text-primary)', margin: '0 0 12px 0', fontWeight: 500 }}>
          Quinoa Buddha Bowl
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 24px 0', maxWidth: '60%' }}>
          Your usual lunch choice. Perfectly balanced macros for your activity today.
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="font-serif" style={{ fontSize: '24px', color: 'var(--brand-olive)', fontWeight: 600, fontStyle: 'italic' }}>
            420 kcal
          </span>
          <button style={{ 
            backgroundColor: 'var(--brand-olive)', color: 'var(--white)', 
            border: 'none', borderRadius: '20px', padding: '8px 16px', 
            fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' 
          }}>
            <Plus size={14} /> Log Now
          </button>
        </div>

        {/* Floating image decoration */}
        <div style={{ position: 'absolute', right: '-40px', top: '20px', width: '160px', height: '160px' }}>
          <Image src="/buddha_bowl_1775501102176.png" alt="Buddha Bowl" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* Another Food Item */}
      <FoodItem title="Raw Organic Almonds" portion="Small handful (28g)" kcal={164} imageSrc="/raw_almonds_1775501081958.png" />

      {/* Custom Barcode float button overlaid on top of Almonds in the mock */}
      <button style={{
        position: 'absolute', right: '32px', bottom: '120px',
        width: '64px', height: '64px', borderRadius: '32px',
        backgroundColor: 'var(--brand-rust)', color: 'var(--white)',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-soft)', cursor: 'pointer'
      }}>
        <ScanBarcode size={32} />
      </button>

      <BottomNav />
    </div>
  );
}
