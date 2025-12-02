import React, { useState, useEffect, useRef } from "react";
import { create, all } from "mathjs";

const math = create(all);

export default function Calculator({ focusRef }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [active, setActive] = useState(false); // <-- local focus state

  const append = (val) => setExpression((prev) => prev + val);

  const clear = () => {
    setExpression("");
    setResult("");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const evaluateExpr = () => {
    try {
      const out = math.evaluate(expression);
      setResult(out.toString());
    } catch (e) {
      setResult("Error");
    }
  };

  // -------------------------------
  // 🔥 Local focus detection
  // -------------------------------
  useEffect(() => {
    const el = focusRef.current;
    if (!el) return;

    const handleFocus = () => setActive(true);
    const handleBlur = () => setActive(false);

    el.addEventListener("focus", handleFocus);
    el.addEventListener("blur", handleBlur);

    return () => {
      el.removeEventListener("focus", handleFocus);
      el.removeEventListener("blur", handleBlur);
    };
  }, []);

  // -------------------------------
  // 🔥 Keyboard handler — uses local active state
  // -------------------------------
  useEffect(() => {
    if (!active) return; // Only listen when calculator is actually focused

    const handleKey = (e) => {
      const key = e.key;

      const singleKeys = "0123456789+-*/().%";

      if (singleKeys.includes(key)) {
        append(key);
        return;
      }

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        evaluateExpr();
        return;
      }

      if (key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }

      if (key === "Delete") {
        e.preventDefault();
        clear();
        return;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expression, active]);

  // -------------------------------

  const basicKeys = [
    "(", ")", "C", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "%", "=",
  ];

  const sciKeys = [
    "sin(", "cos(", "tan(", "pi",
    "log(", "ln(", "sqrt(", "^",
    "e", "abs(", "round(", ",",
  ];

  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      onClick={() => focusRef.current?.focus()}
      className="w-full select-none outline-none"
    >
      {/* Display */}
      <div className="bg-[#1c1c1c] border border-[#424242] rounded-lg p-3 mb-4 h-24 flex flex-col justify-end overflow-hidden">
        <div className="text-sm text-[#e0e0e0] break-all">
          {expression || " "}
        </div>
        <div className="text-xl font-bold text-white mt-1 break-all">
          {result || " "}
        </div>
      </div>

      {/* Scientific Section */}
      <div className="text-xs uppercase mb-1 text-gray-400">Vetenskaplig</div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {sciKeys.map((key) => (
          <button
            key={key}
            onClick={() => append(key)}
            className="p-2 rounded-lg bg-[#1c1c1c] border border-[#424242] text-sm text-[#e0e0e0]
                       hover:bg-[#383838] transition-colors duration-150"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Basic Keypad */}
      <div className="text-xs uppercase mb-1 text-gray-400">Standard</div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {basicKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === "C") return clear();
              if (key === "=") return evaluateExpr();
              append(key);
            }}
            className={`rounded-lg p-3 text-lg font-medium border border-[#424242] 
              ${
                key === "="
                  ? "bg-[#fa7532] text-white hover:bg-[#ff8a4c]"
                  : "bg-[#1c1c1c] text-[#e0e0e0] hover:bg-[#383838]"
              } transition-colors duration-150`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
