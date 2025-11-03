'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import BackButton from "@/components/BackButton";
import { fetchBusinessMetrics, fetchCreditHistory } from "@/lib/api";
import { BusinessMetrics } from "@/lib/types";
import { getUtilizationColor } from "@/components/UtilizationCircle";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

// Credit factor thresholds from PRD
const CREDIT_THRESHOLDS = {
  liquidity: 1.1,
  recurring: 65,
  cycles: 3,
  onTime: 0.95,
};

function getStatusColor(value: number, threshold: number, higherIsBetter: boolean = true): string {
  const meetsThreshold = higherIsBetter ? value >= threshold : value <= threshold;
  return meetsThreshold ? COLORS.green : COLORS.amber;
}

export default function CreditProfilePage() {
  const { sidebarWidth } = useSidebar();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, historyData] = await Promise.all([
          fetchBusinessMetrics('demo-business-1'),
          fetchCreditHistory('demo-business-1'),
        ]);
        setMetrics(metricsData);
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load credit profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-medium" style={{ color: COLORS.indigo }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const business = metrics.business;

  // Prepare chart data - last 30 days for detail view
  const chartData = history.slice(-30).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    balance: Math.round(item.balance),
    recurringRevenue: Math.round(item.recurringRevenue),
    onTimePayments: Math.round(item.onTimePayments * 100),
    liquidity: Number(item.liquidity.toFixed(2)),
  }));

  // Cycle summary data
  const cycleData = Array.from({ length: Math.floor(business.cycleCount || 0) }, (_, i) => ({
    cycle: `Cycle ${i + 1}`,
    balance: 10000 + Math.random() * 15000,
    onTimeRate: 0.85 + Math.random() * 0.15,
  }));

  // Credit factors summary
  const creditFactors = [
    {
      name: 'Liquidity Ratio',
      value: business.liquidity || 0,
      threshold: CREDIT_THRESHOLDS.liquidity,
      unit: '',
      description: 'Measures cash flow health',
      status: (business.liquidity || 0) >= CREDIT_THRESHOLDS.liquidity ? 'excellent' : 'building',
    },
    {
      name: 'Recurring Revenue',
      value: business.recurringPct,
      threshold: CREDIT_THRESHOLDS.recurring,
      unit: '%',
      description: 'Percentage of predictable income',
      status: business.recurringPct >= CREDIT_THRESHOLDS.recurring ? 'excellent' : 'building',
    },
    {
      name: 'Cycle Count',
      value: business.cycleCount || 0,
      threshold: CREDIT_THRESHOLDS.cycles,
      unit: '',
      description: 'Account history length',
      status: (business.cycleCount || 0) >= CREDIT_THRESHOLDS.cycles ? 'excellent' : 'building',
    },
    {
      name: 'On-Time Payments',
      value: Math.round((business.onTimeRate || 0) * 100),
      threshold: CREDIT_THRESHOLDS.onTime * 100,
      unit: '%',
      description: 'Payment reliability score',
      status: (business.onTimeRate || 0) >= CREDIT_THRESHOLDS.onTime ? 'excellent' : 'building',
    },
    {
      name: 'Volatility',
      value: business.volatility,
      threshold: 20,
      unit: '%',
      description: 'Revenue consistency (lower is better)',
      status: business.volatility <= 20 ? 'excellent' : 'building',
      higherIsBetter: false,
    },
    {
      name: 'Account Age',
      value: business.cycleCount ? business.cycleCount * 30 : 0,
      threshold: 90,
      unit: ' days',
      description: 'Days since account opened',
      status: (business.cycleCount || 0) >= 3 ? 'excellent' : 'building',
    },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="mb-3">
              <BackButton customBackPath="/" customLabel="Home" />
            </div>
            <div className="flex items-center space-x-3">
              <Image
                src="/s15-icon.png"
                alt="Station 15"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Your Credit Profile</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {creditFactors.slice(0, 4).map((factor) => (
              <div
                key={factor.name}
                className="bg-white rounded-xl border shadow-sm p-6"
                style={{ borderColor: COLORS.gray200 }}
              >
                <div className="text-sm font-medium mb-1" style={{ color: COLORS.gray600 }}>
                  {factor.name}
                </div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold" style={{ color: COLORS.indigo }}>
                    {typeof factor.value === 'number' && factor.unit === '%' 
                      ? factor.value.toFixed(1) 
                      : Math.round(factor.value)}
                  </span>
                  <span className="text-sm" style={{ color: COLORS.gray500 }}>{factor.unit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: factor.status === 'excellent' ? COLORS.green : COLORS.amber,
                    }}
                  />
                  <span className="text-xs capitalize" style={{ color: COLORS.gray600 }}>
                    {factor.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Credit Factors Detail Grid */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8" style={{ borderColor: COLORS.gray200 }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.gray900 }}>
              Credit Factors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditFactors.map((factor) => {
                const meetsThreshold = factor.higherIsBetter === false
                  ? factor.value <= factor.threshold
                  : factor.value >= factor.threshold;
                
                return (
                  <div key={factor.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.gray900 }}>
                        {factor.name}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: meetsThreshold ? COLORS.green : COLORS.amber,
                        }}
                      >
                        {typeof factor.value === 'number' && factor.unit === '%'
                          ? factor.value.toFixed(1)
                          : Math.round(factor.value)}
                        {factor.unit}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min((factor.value / factor.threshold) * 100, 100)}%`,
                          backgroundColor: meetsThreshold ? COLORS.green : COLORS.amber,
                        }}
                      />
                    </div>
                    <div className="text-xs" style={{ color: COLORS.gray500 }}>
                      {factor.description}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.gray400 }}>
                      Target: {factor.threshold}{factor.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Balance Trend */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
                Balance Trend (30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                  />
                  <YAxis 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke={COLORS.indigo} 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recurring Revenue */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
                Recurring Revenue Pattern
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                  />
                  <YAxis 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recurringRevenue" 
                    stroke={COLORS.green} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.green, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Performance */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
                Payment Performance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                  <XAxis 
                    dataKey="cycle" 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                  />
                  <YAxis 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                    tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${Math.round(value * 100)}%`}
                  />
                  <Bar dataKey="onTimeRate" fill={COLORS.indigo} radius={[8, 8, 0, 0]}>
                    {cycleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.onTimeRate >= CREDIT_THRESHOLDS.onTime ? COLORS.green : COLORS.amber} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Liquidity Trend */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
                Liquidity Ratio Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.map(d => ({ ...d, threshold: CREDIT_THRESHOLDS.liquidity }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                  />
                  <YAxis 
                    tick={{ fill: COLORS.gray600, fontSize: 12 }}
                    stroke={COLORS.gray400}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="liquidity" 
                    stroke={COLORS.crimson} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.crimson, r: 4 }}
                    name="Liquidity Ratio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threshold" 
                    stroke={COLORS.gray400} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name={`Target (${CREDIT_THRESHOLDS.liquidity})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
              Credit Profile Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: COLORS.gray700 }}>
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {creditFactors
                    .filter((f) => {
                      const meets = f.higherIsBetter === false
                        ? f.value <= f.threshold
                        : f.value >= f.threshold;
                      return meets;
                    })
                    .map((factor) => (
                      <li key={factor.name} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm" style={{ color: COLORS.gray600 }}>
                          {factor.name}: {typeof factor.value === 'number' && factor.unit === '%'
                            ? factor.value.toFixed(1)
                            : Math.round(factor.value)}
                          {factor.unit}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: COLORS.gray700 }}>
                  Building
                </h4>
                <ul className="space-y-2">
                  {creditFactors
                    .filter((f) => {
                      const meets = f.higherIsBetter === false
                        ? f.value <= f.threshold
                        : f.value >= f.threshold;
                      return !meets;
                    })
                    .map((factor) => (
                      <li key={factor.name} className="flex items-center space-x-2">
                        <span className="text-amber-500">○</span>
                        <span className="text-sm" style={{ color: COLORS.gray600 }}>
                          {factor.name}: {typeof factor.value === 'number' && factor.unit === '%'
                            ? factor.value.toFixed(1)
                            : Math.round(factor.value)}
                          {factor.unit} → Target: {factor.threshold}{factor.unit}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

