'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { getVisiblePerks, Category } from "@/lib/perks";

const COLORS = {
  indigo: '#312E81',
  indigo900: '#312E81',
  indigo800: '#3730A3',
  crimson: '#DC143C',
  red600: '#DC2626',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate600: '#475569',
  slate700: '#334155',
  white: '#FFFFFF',
};

export default function PerksPage() {
  const { sidebarWidth } = useSidebar();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load visible perks on mount and listen for storage changes
    const loadPerks = () => {
      setCategories(getVisiblePerks());
    };
    
    loadPerks();
    
    // Listen for storage changes (when admin updates visibility)
    const handleStorageChange = () => {
      loadPerks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen to custom event for same-tab updates
    window.addEventListener('perkVisibilityChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('perkVisibilityChanged', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.slate50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Perks</h1>
            </div>
          </div>
        </header>

        <section className="py-20 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-semibold text-center mb-4" style={{ color: COLORS.indigo900 }}>
              Station 15 Perks
            </h2>
            <p className="text-lg text-center mb-12 max-w-2xl mx-auto" style={{ color: COLORS.slate600 }}>
              Membership that actually gives back — tools, funding, and community designed to keep your business moving.
            </p>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: COLORS.slate600 }}>
                  No perks are currently available.
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.name} className="mb-16">
                  <h3 className="text-2xl font-semibold mb-6" style={{ color: COLORS.indigo800 }}>
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.perks.map((perk) => (
                      <div
                        key={perk.title}
                        className="bg-white rounded-2xl shadow-sm p-6 border transition-all duration-200"
                        style={{
                          borderColor: COLORS.slate100,
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                        }}
                      >
                        <h4 className="text-xl font-semibold mb-2" style={{ color: COLORS.indigo900 }}>
                          {perk.title}
                        </h4>
                        <p className="mb-3" style={{ color: COLORS.slate600 }}>
                          {perk.description}
                        </p>
                        <p className="font-medium" style={{ color: COLORS.red600 }}>
                          {perk.hook}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
