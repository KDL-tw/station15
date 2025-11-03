'use client';

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray200: '#E5E7EB',
};

interface UtilizationCircleProps {
  percentage: number;
  size?: number;
}

export default function UtilizationCircle({ percentage, size = 80 }: UtilizationCircleProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.gray200}
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.crimson}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold" style={{ color: COLORS.crimson }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
}

