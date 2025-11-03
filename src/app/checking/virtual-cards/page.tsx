'use client';

import Image from "next/image";
import { useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import BackButton from "@/components/BackButton";

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
};

interface VirtualCard {
  id: string;
  last4: string;
  name: string;
  status: 'active' | 'frozen' | 'cancelled';
  balance: number;
  createdAt: string;
}

export default function VirtualCardsPage() {
  const { sidebarWidth } = useSidebar();
  const [cards, setCards] = useState<VirtualCard[]>([
    {
      id: '1',
      last4: '4242',
      name: 'Marketing Budget',
      status: 'active',
      balance: 2500.00,
      createdAt: '2024-01-10',
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [cardName, setCardName] = useState('');
  const [creatingStep, setCreatingStep] = useState(0);

  const handleCreateCard = () => {
    setIsCreating(true);
    setCreatingStep(1);
    
    // Mock process: step 1 -> step 2 -> step 3 -> complete
    setTimeout(() => {
      setCreatingStep(2);
      setTimeout(() => {
        setCreatingStep(3);
        setTimeout(() => {
          // Generate mock card
          const newCard: VirtualCard = {
            id: Date.now().toString(),
            last4: Math.floor(1000 + Math.random() * 9000).toString(),
            name: cardName || 'New Virtual Card',
            status: 'active',
            balance: 0,
            createdAt: new Date().toISOString().split('T')[0],
          };
          
          setCards([...cards, newCard]);
          setIsCreating(false);
          setCardName('');
          setCreatingStep(0);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="mb-3">
              <BackButton />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/s15-icon.png"
                  alt="Station 15"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Virtual Cards</h1>
              </div>
              <button
                onClick={handleCreateCard}
                disabled={isCreating}
                className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: COLORS.indigo,
                  color: '#FFFFFF',
                }}
              >
                {isCreating ? 'Creating...' : 'Make New Virtual Card'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Creation Process Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4" style={{ borderColor: COLORS.gray200 }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.gray900 }}>
                  Creating Virtual Card
                </h2>
                
                {creatingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                        Card Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g., Marketing Budget"
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ borderColor: COLORS.gray300 }}
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setCardName('');
                          setCreatingStep(0);
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ color: COLORS.gray600, backgroundColor: COLORS.gray100 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCreatingStep(2)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: COLORS.indigo }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {creatingStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.indigo }}></div>
                    </div>
                    <p className="text-center" style={{ color: COLORS.gray600 }}>
                      Generating card number...
                    </p>
                  </div>
                )}

                {creatingStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.green }}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-center font-semibold" style={{ color: COLORS.gray900 }}>
                      Virtual card created successfully!
                    </p>
                    <p className="text-center text-sm" style={{ color: COLORS.gray600 }}>
                      Your card is ready to use.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.gray200 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                    {card.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: card.status === 'active' ? COLORS.green : COLORS.gray300,
                      color: card.status === 'active' ? '#FFFFFF' : COLORS.gray700,
                    }}
                  >
                    {card.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Card Number</div>
                  <div className="text-xl font-mono font-semibold" style={{ color: COLORS.gray900 }}>
                    •••• •••• •••• {card.last4}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Balance</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.indigo }}>
                    ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="text-xs" style={{ color: COLORS.gray500 }}>
                  Created {new Date(card.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

            {cards.length === 0 && !isCreating && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg" style={{ color: COLORS.gray500 }}>
                  No virtual cards yet. Create your first one!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

