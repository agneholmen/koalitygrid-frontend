// utils/formatSmartNumber.js
import { useSettings } from '../context/SettingsContext';


export const useFormatSmartNumber = () => {
  const { decimalPlaces } = useSettings();

  const format = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '—';

    const number = Number(num);
    if (Number.isInteger(number)) return number.toString();

    // For very small/large numbers, use scientific notation
    const abs = Math.abs(number);
    if (abs < 1e-6 || abs > 1e6) {
      return number.toExponential(decimalPlaces);
    }

    const formatted = number.toFixed(decimalPlaces);
    return formatted.replace(/\.?0+$/, '').replace(/\.$/, '');
  };

  return format;
};