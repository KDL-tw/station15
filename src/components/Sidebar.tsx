'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from 'react';

// Sidebar Context
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  sidebarWidth: string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? '64px' : '256px';

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    return { collapsed: false, setCollapsed: () => {}, sidebarWidth: '256px' };
  }
  return context;
}

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

function SidebarContent() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Checking', href: '/checking', icon: '💳' },
    { name: 'Charge Card', href: '/charge-card', icon: '💳' },
    { name: 'Flex', href: '/flex', icon: '📈' },
    { name: 'Transfers', href: '/transfers', icon: '🔄' },
    { name: 'Perks', href: '/perks', icon: '🎁' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen flex flex-col border-r transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        style={{ 
          backgroundColor: COLORS.gray900,
          borderColor: COLORS.gray800,
          zIndex: 50,
        }}
      >
        {/* Logo Section - Simple text when collapsed */}
        <div className="p-6 border-b" style={{ borderColor: COLORS.gray800 }}>
          <div className="flex items-center justify-between">
            {!collapsed && (
              <Link href="/" className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                S15
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-gray-800 transition-colors"
              style={{ color: '#FFFFFF' }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? '' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: active ? COLORS.gray800 : 'transparent',
                  color: '#FFFFFF',
                  borderLeft: active ? `3px solid ${COLORS.indigo}` : '3px solid transparent',
                }}
                title={collapsed ? item.name : undefined}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link */}
        <div className="p-4 border-t" style={{ borderColor: COLORS.gray800 }}>
          <Link
            href="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin') ? '' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: isActive('/admin') ? COLORS.gray800 : 'transparent',
              color: isActive('/admin') ? COLORS.crimson : '#FFFFFF',
              borderLeft: isActive('/admin') ? `3px solid ${COLORS.crimson}` : '3px solid transparent',
            }}
            title={collapsed ? 'Admin' : undefined}
          >
            <span className="text-lg flex-shrink-0">⚙️</span>
            {!collapsed && <span className="text-sm font-medium">Admin</span>}
          </Link>
        </div>

        {/* User Profile Section */}
        {!collapsed && (
          <div className="p-4 border-t" style={{ borderColor: COLORS.gray800, backgroundColor: COLORS.gray800 }}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
              >
                DB
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">Demo Business</div>
                <div className="text-xs truncate" style={{ color: COLORS.gray400 }}>demo@business.com</div>
              </div>
            </div>
          </div>
        )}
      </aside>

    </>
  );
}

export default function Sidebar() {
  return <SidebarContent />;
}
