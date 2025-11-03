'use client';

import Image from "next/image";
import Sidebar from "@/components/Sidebar";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray200: '#E5E7EB',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
};

export default function FlexPage() {
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Flex Loan / AP Mgmt</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <p className="text-base mb-8" style={{ color: COLORS.gray600 }}>Net-term slider → 'Days Gained.'</p>
          
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                  Net-term slider
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  defaultValue="30" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: COLORS.gray600 }}>
                  <span>0 days</span>
                  <span>30 days</span>
                  <span>90 days</span>
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: COLORS.gray200 }}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: COLORS.crimson }}>
                    +15 Days Gained
                  </div>
                  <p className="text-sm" style={{ color: COLORS.gray600 }}>
                    Based on current eligibility: (cycles≥3) AND (on_time≥0.95) AND (recurring≥0.65) AND (liquidity≥1.1)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
