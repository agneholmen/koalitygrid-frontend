// hooks/useLocalDecimalOverride.js
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export const useLocalDecimalOverride = (onDecimalsChange) => {
  const { decimalPlaces: globalDecimalPlaces } = useSettings();
  const [localDecimalPlaces, setLocalDecimalPlaces] = useState(globalDecimalPlaces);
  const [useLocalDecimals, setUseLocalDecimals] = useState(false);

  const effectiveDecimalPlaces = useLocalDecimals ? localDecimalPlaces : globalDecimalPlaces;

  const setDecimals = (value) => {
    const num = parseInt(value, 10);
    if (num >= 0 && num <= 10) {
      setLocalDecimalPlaces(num);
      setUseLocalDecimals(true);
      onDecimalsChange?.(num);
    }
  };

  const resetToGlobal = () => {
    setLocalDecimalPlaces(globalDecimalPlaces);
    setUseLocalDecimals(false);
    onDecimalsChange?.(globalDecimalPlaces);
  };

  return {
    effectiveDecimalPlaces,
    localDecimalPlaces,
    useLocalDecimals,
    setDecimals,
    resetToGlobal,
    isUsingLocal: useLocalDecimals,
  };
};