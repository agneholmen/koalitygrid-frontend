// utils/formatNumber.js
import { useSettings } from '../context/SettingsContext';

export const useFormatNumber = () => {
  const { decimalPlaces } = useSettings();

  const format = (num, decimals = decimalPlaces) => {
    if (num === null || num === undefined || isNaN(num)) return '—';

    const number = Number(num);
    
    // Handle integers (no decimals needed)
    if (Number.isInteger(number)) {
      return number.toString();
    }

    // Format to user's max decimals, then intelligently trim
    const formatted = number.toFixed(decimals);
    
    // Remove trailing zeros after decimal point
    let result = formatted.replace(/\.?0+$/, '');
    
    // If it ends with a decimal point, remove it too
    result = result.replace(/\.$/, '');
    
    return result;
  };

  return format;
};