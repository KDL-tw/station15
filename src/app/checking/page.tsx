'use client';

import Link from "next/link";

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
};

export default function CheckingPage() {
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
              <Link href="/charge-card" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Charge Card
              </Link>
              <Link href="/flex" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Flex
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-semibold mb-4" style={{ color: COLORS.indigo }}>
            Checking
          </h1>
          <p className="text-gray-600 mb-8">Transaction feed + heatmap</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="text-gray-500">Transaction feed placeholder (TODO: implement with Recharts heatmap)</div>
              <div className="h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-400">Heatmap visualization</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
