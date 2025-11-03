'use client';

import { useState } from "react";

const COLORS = {
  indigo: '#312E81',
  gray200: '#E5E7EB',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export default function CreditLimitTooltip() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-2 text-sm cursor-help"
        style={{ color: COLORS.gray600 }}
        aria-label="Credit Limit Information"
      >
        ℹ️
      </button>
      
      {show && (
        <div 
          className="absolute left-0 top-full mt-2 w-72 p-4 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: COLORS.gray200,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <h4 className="font-semibold mb-3" style={{ color: COLORS.gray900 }}>
            Credit Limit: How it works
          </h4>
          <div className="space-y-2 text-sm" style={{ color: COLORS.gray700 }}>
            <div>
              <strong>Starting limit:</strong> 20% of average balance
            </div>
            <div>
              <strong>Increases with:</strong> Payment history + revenue consistency
            </div>
            <div>
              <strong>Next review:</strong> 23 days
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

