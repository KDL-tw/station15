'use client';

import Link from "next/link";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
};

export default function FlexPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <header className="bg-white shadow-sm border-b" style={{ borderColor: `${COLORS.indigo}20` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: COLORS.indigo }}>Station 15</Link>
            <nav className="flex space-x-4">
              <Link href="/" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-semibold mb-4" style={{ color: COLORS.indigo }}>
            Flex Loan / AP Mgmt
          </h1>
          <p className="text-gray-600 mb-8">Net-term slider → 'Days Gained.'</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net-term slider
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  defaultValue="30" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 days</span>
                  <span>30 days</span>
                  <span>90 days</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: COLORS.crimson }}>
                    +15 Days Gained
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on current eligibility: (cycles≥3) AND (on_time≥0.95) AND (recurring≥0.65) AND (liquidity≥1.1)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
