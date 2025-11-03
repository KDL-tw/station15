'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Business, Decision, RuleEvent, RulesConfig } from "@/lib/types";
import { ALL_PERKS, getPerkVisibility, togglePerkVisibility, PerkVisibility } from "@/lib/perks";

// Admin UI Style: neutral gray grid, monospace numerics, keyboard shortcuts, print-friendly
const ADMIN_COLORS = {
  gray: '#6B7280',
  darkGray: '#374151',
  lightGray: '#F3F4F6',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Business List');
  const [perkVisibility, setPerkVisibility] = useState<PerkVisibility>({});

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
    { name: 'Perks Manager', shortcut: 'K' },
  ];

  const renderBusinessList = () => (
    <div className="bg-white border border-gray-300">
      <table className="w-full text-sm" style={{ fontFamily: 'monospace' }}>
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left border-b border-gray-300" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '600' }}>ID</th>
            <th className="px-4 py-2 text-left border-b border-gray-300" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '600' }}>Name</th>
            <th className="px-4 py-2 text-right border-b border-gray-300" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '600' }}>Balance</th>
            <th className="px-4 py-2 text-right border-b border-gray-300" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '600' }}>Limit</th>
            <th className="px-4 py-2 text-center border-b border-gray-300" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '600' }}>Risk Tier</th>
          </tr>
        </thead>
        <tbody>
          {mockBusinesses.map((business) => (
            <tr key={business.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2" style={{ fontFamily: 'monospace', fontSize: '11px', color: ADMIN_COLORS.darkGray }}>
                {business.id.substring(0, 8)}
              </td>
              <td className="px-4 py-2" style={{ color: ADMIN_COLORS.darkGray, fontWeight: '500' }}>{business.name}</td>
              <td className="px-4 py-2 text-right" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>
                ${business.currentBalance.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>
                ${business.chargeLimit.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                <span className="px-2 py-1 text-xs bg-gray-300 rounded font-medium" style={{ color: ADMIN_COLORS.darkGray }}>
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
          <div className="text-xs mb-1 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>{metric}</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>
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
          <div className="text-xs mb-1 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>Limit</div>
          <div className="text-xl font-bold" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>$100,000</div>
        </div>
        <div>
          <div className="text-xs mb-1 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>Term</div>
          <div className="text-xl font-bold" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>30 days</div>
        </div>
        <div>
          <div className="text-xs mb-1 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>APR Band</div>
          <div className="text-xl font-bold" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>12.5-15.0%</div>
        </div>
        <div>
          <div className="text-xs mb-1 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>Reason Codes</div>
          <div className="text-sm font-medium" style={{ color: ADMIN_COLORS.darkGray }}>
            {mockDecisions[0]?.reasonCodes.join(', ') || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRulesManager = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2" style={{ color: ADMIN_COLORS.darkGray }}>Rules Configuration (Version {mockRules.version})</h3>
        <pre className="text-xs bg-gray-50 p-3 border border-gray-300" style={{ fontFamily: 'monospace', color: ADMIN_COLORS.darkGray }}>
          {JSON.stringify(mockRules.rules, null, 2)}
        </pre>
      </div>
      <button className="px-4 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-800">
        Edit Thresholds → Instant Recalc
      </button>
    </div>
  );

  const renderCycleSimulator = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2" style={{ color: ADMIN_COLORS.darkGray }}>Cycle Simulator</h3>
        <p className="text-xs mb-4 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>Advance time / Stress events</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-800">
          Advance 30 Days
        </button>
        <button className="px-4 py-2 border border-gray-400 text-sm font-medium hover:bg-gray-50" style={{ color: ADMIN_COLORS.darkGray }}>
          Stress Event
        </button>
      </div>
    </div>
  );

  // Load perk visibility on mount
  useEffect(() => {
    setPerkVisibility(getPerkVisibility());
  }, []);

  const handleTogglePerkVisibility = (categoryName: string, perkTitle: string, visible: boolean) => {
    const updated = togglePerkVisibility(categoryName, perkTitle, visible);
    setPerkVisibility(updated);
    // Dispatch custom event to update perks page in same tab
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('perkVisibilityChanged'));
    }
  };

  const renderPerksManager = () => (
    <div className="bg-white border border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2" style={{ color: ADMIN_COLORS.darkGray }}>Perks Visibility Manager</h3>
        <p className="text-xs mb-4" style={{ color: ADMIN_COLORS.darkGray }}>
          Toggle visibility for individual perk cards. Hidden perks will not appear on the user-facing perks page.
        </p>
      </div>
      
      <div className="space-y-6">
        {ALL_PERKS.map((category) => (
          <div key={category.name} className="border-b border-gray-200 pb-4 last:border-b-0">
            <h4 className="text-sm font-semibold mb-3" style={{ color: ADMIN_COLORS.darkGray }}>
              {category.name}
            </h4>
            <div className="space-y-2">
              {category.perks.map((perk) => {
                const isVisible = perkVisibility[category.name]?.[perk.title] !== false;
                return (
                  <div
                    key={perk.title}
                    className="flex items-center justify-between p-3 border border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1" style={{ color: ADMIN_COLORS.darkGray }}>{perk.title}</div>
                      <div className="text-xs line-clamp-1" style={{ color: ADMIN_COLORS.gray }}>{perk.description}</div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          isVisible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => handleTogglePerkVisibility(category.name, perk.title, !isVisible)}
                        className={`px-3 py-1 text-xs border transition-colors font-medium ${
                          isVisible
                            ? 'border-gray-400 bg-white hover:bg-gray-100'
                            : 'border-gray-700 bg-gray-700 text-white hover:bg-gray-800'
                        }`}
                        style={isVisible ? { color: ADMIN_COLORS.darkGray } : {}}
                      >
                        {isVisible ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="text-xs font-medium" style={{ color: ADMIN_COLORS.darkGray }}>
          <strong>Note:</strong> Changes take effect immediately on the user-facing perks page.
        </div>
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
        return <div className="bg-white border border-gray-300 p-4"><p style={{ color: ADMIN_COLORS.darkGray, fontWeight: '500' }}>Charts + Event log (placeholder)</p></div>;
      case 'Audit / Compliance':
        return <div className="bg-white border border-gray-300 p-4"><p style={{ color: ADMIN_COLORS.darkGray, fontWeight: '500' }}>Model Card snapshot, exports (placeholder)</p></div>;
      case 'Setup Wizard':
        return <div className="bg-white border border-gray-300 p-4"><p style={{ color: ADMIN_COLORS.darkGray, fontWeight: '500' }}>Create mock businesses fast (placeholder)</p></div>;
      case 'Perks Manager':
        return renderPerksManager();
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
                className={`px-3 py-2 text-xs border-b-2 transition-colors font-medium ${
                  activeTab === tab.name
                    ? 'border-gray-700'
                    : 'border-transparent'
                }`}
                style={{
                  color: activeTab === tab.name ? ADMIN_COLORS.darkGray : ADMIN_COLORS.gray,
                }}
                title={`Keyboard shortcut: ${tab.shortcut}`}
              >
                {tab.name} <span style={{ color: ADMIN_COLORS.gray, fontWeight: '400' }}>[{tab.shortcut}]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {renderTabContent()}
        </div>

        {/* Footer - Operational Truth Layer */}
        <div className="text-xs text-center mt-8 pb-4 font-medium" style={{ color: ADMIN_COLORS.darkGray }}>
          Operational truth layer — pure function, no ornament
        </div>
      </main>
    </div>
  );
}