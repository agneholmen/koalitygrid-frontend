// context/SettingsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [decimalPlaces, setDecimalPlaces] = useState(() => {
    const saved = localStorage.getItem('calc_decimal_places');
    return saved ? parseInt(saved, 10) : 2; // default: 2 decimals
  });

  useEffect(() => {
    localStorage.setItem('calc_decimal_places', decimalPlaces.toString());
  }, [decimalPlaces]);

  return (
    <SettingsContext.Provider value={{ decimalPlaces, setDecimalPlaces }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);