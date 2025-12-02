// components/SettingsPanel.jsx
import { useSettings } from '../context/SettingsContext';

const SettingsPanel = () => {
  const { decimalPlaces, setDecimalPlaces } = useSettings(); // Direct access

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 10) {
      setDecimalPlaces(value);
    }
  };

  return (
    <div className="p-6 text-[#e0e0e0]">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Antal decimaler i resultat
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={decimalPlaces}
              onChange={handleChange}
              className="flex-1 ..."
            />
            <span className="w-12 text-center font-mono text-lg bg-[#383838] rounded px-2 py-1">
              {decimalPlaces}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;