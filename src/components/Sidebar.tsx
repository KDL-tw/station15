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

// SVG Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CheckingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const FlexIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TransferIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const PerksIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const AdminIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

function SidebarContent() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Checking', href: '/checking', icon: CheckingIcon },
    { name: 'Charge Card', href: '/charge-card', icon: CardIcon },
    { name: 'Flex', href: '/flex', icon: FlexIcon },
    { name: 'Transfers', href: '/transfers', icon: TransferIcon },
    { name: 'Perks', href: '/perks', icon: PerksIcon },
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
            const IconComponent = item.icon;
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
                <IconComponent className="flex-shrink-0" />
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
            <AdminIcon className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Admin</span>}
          </Link>
        </div>

        {/* User Profile Section */}
        {!collapsed && (
          <div className="p-4 border-t relative" style={{ borderColor: COLORS.gray800, backgroundColor: COLORS.gray800 }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
              >
                AC
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-white truncate">ABC Corp</div>
                <div className="text-xs truncate" style={{ color: COLORS.gray400 }}>abc@corp.com</div>
              </div>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div 
                className="absolute bottom-full left-4 right-4 mb-2 rounded-lg border shadow-lg z-50"
                style={{
                  backgroundColor: COLORS.gray800,
                  borderColor: COLORS.gray700,
                }}
              >
                <div className="py-2">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Account
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t my-1" style={{ borderColor: COLORS.gray700 }} />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      // TODO: Implement logout
                      setShowProfileMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default function Sidebar() {
  return <SidebarContent />;
}
