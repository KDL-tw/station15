'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

export default function Sidebar() {
  const pathname = usePathname();

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
    <aside 
      className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r"
      style={{ 
        backgroundColor: COLORS.gray900,
        borderColor: COLORS.gray800,
      }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.gray800 }}>
        <Link href="/" className="flex items-center">
          <Image
            src="/station15-logo.png"
            alt="Station 15"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
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
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
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
        >
          <span className="text-lg">⚙️</span>
          <span className="text-sm font-medium">Admin</span>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.gray800, backgroundColor: COLORS.gray800 }}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
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
    </aside>
  );
}

