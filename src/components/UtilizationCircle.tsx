'use client';

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray200: '#E5E7EB',
};

// Heatmap color function based on utilization
export function getUtilizationColor(percentage: number): string {
  if (percentage < 25) return '#10B981'; // Green - Low utilization
  if (percentage < 50) return '#F59E0B'; // Amber - Medium utilization
  if (percentage < 75) return '#EF4444'; // Red - High utilization
  return '#DC2626'; // Dark red - Very high utilization
}

interface UtilizationCircleProps {
  percentage: number;
  size?: number;
}

export default function UtilizationCircle({ percentage, size = 80 }: UtilizationCircleProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getUtilizationColor(percentage);

  return (
    <div className="flex items-center justify-center relative">
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
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold" style={{ color }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
}
