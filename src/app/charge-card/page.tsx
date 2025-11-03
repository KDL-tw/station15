'use client';

import Link from "next/link";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
};

export default function ChargeCardPage() {
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
            Charge Card
          </h1>
          <p className="text-gray-600 mb-8">Entry product (20% avg balance); limit adapts per cycle</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Limit</span>
                <span className="text-2xl font-semibold" style={{ color: COLORS.indigo }}>$50,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Balance (30d)</span>
                <span className="text-xl" style={{ fontFamily: 'monospace' }}>$125,000</span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Limit calculation: min(0.20 × avg_balance_30d, policy_cap, 0.5 × peak_inflow)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
