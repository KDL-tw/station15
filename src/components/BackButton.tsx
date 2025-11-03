'use client';

import { usePathname, useRouter } from 'next/navigation';

const COLORS = {
  indigo: '#312E81',
  gray600: '#4B5563',
  gray700: '#374151',
};

interface BackButtonProps {
  customBackPath?: string;
  customLabel?: string;
}

export default function BackButton({ customBackPath, customLabel }: BackButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine if this is a sub-page
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const isSubPage = pathSegments.length > 1;

  if (!isSubPage && !customBackPath) {
    return null;
  }

  // Determine parent path
  let parentPath: string;
  let label: string;

  if (customBackPath) {
    parentPath = customBackPath;
    label = customLabel || 'Back';
  } else {
    // Remove last segment to get parent
    const parentSegments = pathSegments.slice(0, -1);
    parentPath = parentSegments.length > 0 ? `/${parentSegments.join('/')}` : '/';
    
    // Get readable label from parent segment
    const parentSegment = parentSegments[parentSegments.length - 1];
    label = parentSegment 
      ? parentSegment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'Home';
  }

  const handleBack = () => {
    router.push(parentPath);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100"
      style={{
        color: COLORS.gray700,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F3F4F6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      <span className="text-sm font-medium">Back to {label}</span>
    </button>
  );
}

