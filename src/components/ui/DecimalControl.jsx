// components/ui/DecimalControl.jsx
import React from 'react';

const DecimalControl = ({ 
  decimals, 
  onChange, 
  isUsingLocal = false,
  className = '',
  onReset
}) => {
  return (
    <div 
      className={`
        flex items-center gap-2 rounded-lg p-3 min-w-[140px] transition-all duration-200
        ${className}
        ${isUsingLocal 
          ? 'bg-[#fa7532/20] border-2 border-[#fa7532/30] shadow-sm' 
          : 'bg-[#383838] border border-[#555]'
        }
      `}
    >
      <span className="text-sm font-medium text-gray-300 whitespace-nowrap">
        {isUsingLocal ? 'Lokal:' : 'Decimaler:'}
      </span>
      
      <select
        value={decimals}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-[#282828] text-white border border-[#555] rounded 
          px-2 py-1 text-sm min-w-[50px] 
          focus:ring-2 focus:ring-[#fa7532] focus:border-transparent
          focus:outline-none transition-all duration-150
        "
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Optional subtle reset indicator */}
      {isUsingLocal && (
        <button
          onClick={() => onReset?.()}
          className="
            ml-2 p-1 rounded-full hover:bg-[#fa7532/30] 
            transition-colors duration-150 text-[#fa7532]/70 
            hover:text-[#fa7532] text-s font-semibold
          "
          title="Återställ till globalt värde"
        >
          ↺
        </button>
      )}
    </div>
  );
};

export default DecimalControl;