'use client';

import Image from "next/image";
import Sidebar from "@/components/Sidebar";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray900: '#111827',
};

export default function CheckingPage() {
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Checking</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <p className="text-base mb-8" style={{ color: COLORS.gray600 }}>Transaction feed + heatmap</p>
          
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <div className="space-y-4">
              <div style={{ color: COLORS.gray500 }}>Transaction feed placeholder (TODO: implement with Recharts heatmap)</div>
              <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center" style={{ borderColor: COLORS.gray300 }}>
                <span style={{ color: COLORS.gray400 }}>Heatmap visualization</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
