import { useRef, useState } from 'react';
import Qty from 'js-quantities';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useLocalDecimalOverride } from '../../hooks/useLocalDecimalOverride';
import DecimalControl from '../../components/ui/DecimalControl';
import { useFormatNumber } from '../../utils/formatNumber';

const EnergyConverter = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [unit, setUnit] = useState('J');
  const modalContentRef = useRef(null);
  const inputRef = useRef(null);
  const format = useFormatNumber();

  const units = {
    'J': 'Joule',
    'kJ': 'Kilojoule',
    'MJ': 'Megajoule',
    'cal': 'Kalorier',
    'kcal': 'Kilokalorier',
    'Wh': 'Wattimmar',
    'kWh': 'Kilowattimmar',
    'MWh': 'Megawattimmar',
    'BTU': 'BTU',
  };

  const {
    effectiveDecimalPlaces,
    setDecimals,
    resetToGlobal,
    isUsingLocal
  } = useLocalDecimalOverride((newDecimals) => {
    // Auto-recalculate when decimals change
    if (validateInput()) {
      calculate();
    }
  });

  const validateInput = () => {
    if (!value || isNaN(value) || parseFloat(value) < 0) {
      return false;
    }
    return true;
  };

  const calculate = async (forcedUnit = unit) => {
    if (!validateInput()) {
      setResult({ error: 'Vänligen fyll i fältet med en giltig siffra.' });
      return;
    }

    const resultData = [];
    Object.keys(units).forEach((key) => {
      if (key !== forcedUnit) {
        try {
          const converted = Qty(`${value} ${forcedUnit}`).to(key).scalar;
          resultData.push({
            unit: key,
            text: units[key],
            result: converted,
          });
        } catch (err) {
          console.error(`Conversion error from ${forcedUnit} to ${key}:`, err);
        }
      }
    });
    setResult({ data: resultData });
  };

  useKeyboardShortcuts({
    targetRef: modalContentRef,
    onEnter: calculate,
  });

  return (
    <div 
      ref={modalContentRef}
      tabIndex={-1}
      className="rounded-lg flex items-center justify-center p-4 bg-[#1c1c1c]"
    >
      <div className="max-w-lg">
        <div className="grid mb-6">
          <div className="flex flex-col">
            <label className="calc-form-label">Energi:</label>
            <div className="flex">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`calc-form-input-split`}
                min="0"
                ref={inputRef}
              />
              <select
                value={unit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  setUnit(newUnit);
                  if (value && !isNaN(value) && parseFloat(value) > 0) {
                    calculate(newUnit);
                  }
                  inputRef.current?.focus();
                }}
                className="calc-form-select-split"
              >
                {Object.keys(units).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex justify-center">
            <button
              onClick={() => calculate()}
              className="calc-form-submit-button"
            >
              Beräkna
            </button>
          </div>
          
          <DecimalControl
            decimals={effectiveDecimalPlaces}
            onChange={setDecimals}
            isUsingLocal={isUsingLocal}
            onReset={resetToGlobal}
          />
        </div>
        <div>
          {result && (
            <div className="mt-4 p-4 bg-[#383838] rounded">
              {result.error ? (
                <p className="text-red-400 font-bold mb-2">{result.error}</p>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[#fa7532] mb-2">Resultat:</h3>
                  {result.data.map((item) => (
                    <p className="text-gray-200">{item.text} ({item.unit}): {format(item.result, effectiveDecimalPlaces)}</p>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnergyConverter;