'use client';

import Image from "next/image";
import Sidebar from "@/components/Sidebar";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray900: '#111827',
};

export default function PerksPage() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '256px' }}>
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/s15-icon.png"
                alt="Station 15"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Perks / Commons</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <p className="text-base mb-8" style={{ color: COLORS.gray600 }}>Placeholder for benefits</p>
          
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <p style={{ color: COLORS.gray500 }}>Benefits and perks section (to be implemented)</p>
          </div>
        </main>
      </div>
    </div>
  );
}
