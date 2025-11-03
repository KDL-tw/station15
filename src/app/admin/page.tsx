'use client';

import Link from "next/link";
import { useState } from "react";
import { Business, Decision, RuleEvent, RulesConfig } from "@/lib/types";

// Admin UI Style: neutral gray grid, monospace numerics, keyboard shortcuts, print-friendly
const ADMIN_COLORS = {
  gray: '#6B7280',
  darkGray: '#374151',
  lightGray: '#F3F4F6',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Business List');

  // Mock data - TODO: Replace with actual API calls
  const mockBusinesses: Business[] = [
    {
      id: "business-1",
      name: "TechCorp Inc",
      balance: 25000,
      recurringPct: 68.5,
      volatility: 12.3,
      chargeLimit: 100000,
      currentBalance: 25000,
      flexState: { riskLevel: "medium", sector: "Technology" },
      cycleCount: 4,
      onTimeRate: 0.96,
      liquidity: 1.2,
    },
    {
      id: "business-2",
      name: "RetailPlus LLC",
      balance: 15000,
      recurringPct: 72.1,
      volatility: 8.5,
      chargeLimit: 50000,
      currentBalance: 15000,
      flexState: { riskLevel: "low", sector: "Retail" },
      cycleCount: 5,
      onTimeRate: 0.98,
      liquidity: 1.4,
    }
  ];

  const mockRules: RulesConfig = {
    id: "rules-1",
    version: 1,
    rules: {
      creditLimitMultiplier: 2.5,
      riskThresholds: {
        low: 0.3,
        medium: 0.6,
        high: 0.8
      }
    },
    effectiveAt: "2024-01-01T00:00:00Z",
    createdBy: "admin-user-1"
  };

  const mockDecisions: Decision[] = [
    {
      id: "decision-1",
      decisionType: "underwrite",
      limit: 100000,
      term: 30,
      reason: "Standard underwriting evaluation",
      reasonCodes: ["credit_score_good", "revenue_stable"],
      aprBand: "standard",
      decision: { approved: true, limit: 100000 },
      createdAt: "2024-01-10T10:00:00Z"
    }
  ];

  const mockRuleEvents: RuleEvent[] = [
    {
      id: "event-1",
      ruleId: "credit_limit_check",
      ruleName: "credit_limit_check",
      trigger: { input: 75000, threshold: 100000 },
      triggerDetail: { input: 75000, threshold: 100000 },
      outcome: "passed",
      timestamp: "2024-01-10T10:00:00Z",
      createdAt: "2024-01-10T10:00:00Z"
    }
  ];

  const tabs = [
    { name: 'Business List', shortcut: 'B' },
    { name: 'Live Metrics', shortcut: 'M' },
    { name: 'Decision Output', shortcut: 'D' },
    { name: 'Rules Manager', shortcut: 'R' },
    { name: 'Cycle Simulator', shortcut: 'C' },
    { name: 'Profile Drill-Down', shortcut: 'P' },
    { name: 'Audit / Compliance', shortcut: 'A' },
    { name: 'Setup Wizard', shortcut: 'S' },
  ];

  const renderBusinessList = () => (
    <div className="bg-white border border-gray-300">
      <table className="w-full text-sm" style={{ fontFamily: 'monospace' }}>
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left border-b border-gray-300">ID</th>
            <th className="px-4 py-2 text-left border-b border-gray-300">Name</th>
            <th className="px-4 py-2 text-right border-b border-gray-300">Balance</th>
            <th className="px-4 py-2 text-right border-b border-gray-300">Limit</th>
            <th className="px-4 py-2 text-center border-b border-gray-300">Risk Tier</th>
          </tr>
        </thead>
        <tbody>
          {mockBusinesses.map((business) => (
            <tr key={business.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                {business.id.substring(0, 8)}
              </td>
              <td className="px-4 py-2">{business.name}</td>
              <td className="px-4 py-2 text-right" style={{ fontFamily: 'monospace' }}>
                ${business.currentBalance.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right" style={{ fontFamily: 'monospace' }}>
                ${business.chargeLimit.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                  {business.flexState.riskLevel || 'N/A'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLiveMetrics = () => (
    <div className="grid grid-cols-4 gap-4">
      {['Liquidity', 'Recurring %', 'Volatility', 'Cycle Count'].map((metric) => (
        <div key={metric} className="bg-white border border-gray-300 p-4">
          <div className="text-xs text-gray-500 mb-1">{metric}</div>
          <div className="text-2xl" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>
            {metric === 'Liquidity' ? '1.2' : 
             metric === 'Recurring %' ? '68.5' :
             metric === 'Volatility' ? '12.3' : '4'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDecisionOutput = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Limit</div>
          <div className="text-xl" style={{ fontFamily: 'monospace' }}>$100,000</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Term</div>
          <div className="text-xl" style={{ fontFamily: 'monospace' }}>30 days</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">APR Band</div>
          <div className="text-xl" style={{ fontFamily: 'monospace' }}>12.5-15.0%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Reason Codes</div>
          <div className="text-sm">
            {mockDecisions[0]?.reasonCodes.join(', ') || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRulesManager = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Rules Configuration (Version {mockRules.version})</h3>
        <pre className="text-xs bg-gray-50 p-3 border border-gray-300" style={{ fontFamily: 'monospace' }}>
          {JSON.stringify(mockRules.rules, null, 2)}
        </pre>
      </div>
      <button className="px-4 py-2 bg-gray-700 text-white text-sm hover:bg-gray-800">
        Edit Thresholds → Instant Recalc
      </button>
    </div>
  );

  const renderCycleSimulator = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Cycle Simulator</h3>
        <p className="text-xs text-gray-600 mb-4">Advance time / Stress events</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-gray-700 text-white text-sm hover:bg-gray-800">
          Advance 30 Days
        </button>
        <button className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50">
          Stress Event
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Business List':
        return renderBusinessList();
      case 'Live Metrics':
        return renderLiveMetrics();
      case 'Decision Output':
        return renderDecisionOutput();
      case 'Rules Manager':
        return renderRulesManager();
      case 'Cycle Simulator':
        return renderCycleSimulator();
      case 'Profile Drill-Down':
        return <div className="bg-white border border-gray-300 p-4">Charts + Event log (placeholder)</div>;
      case 'Audit / Compliance':
        return <div className="bg-white border border-gray-300 p-4">Model Card snapshot, exports (placeholder)</div>;
      case 'Setup Wizard':
        return <div className="bg-white border border-gray-300 p-4">Create mock businesses fast (placeholder)</div>;
      default:
        return renderBusinessList();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: ADMIN_COLORS.lightGray }}>
      {/* Header - Neutral */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-mono" style={{ color: ADMIN_COLORS.darkGray }}>
                S15 / Admin
              </Link>
            </div>
            <nav className="flex space-x-2">
              <Link
                href="/"
                className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-50"
              >
                User UI
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Grid Layout */}
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Tabs - Print-friendly */}
        <div className="mb-4 border-b border-gray-300">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-2 text-xs border-b-2 transition-colors ${
                  activeTab === tab.name
                    ? 'border-gray-700 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                title={`Keyboard shortcut: ${tab.shortcut}`}
              >
                {tab.name} <span className="text-gray-400">[{tab.shortcut}]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {renderTabContent()}
        </div>

        {/* Footer - Operational Truth Layer */}
        <div className="text-xs text-gray-500 text-center mt-8 pb-4">
          Operational truth layer — pure function, no ornament
        </div>
      </main>
    </div>
  );
}