import { useEffect } from "react";

export function useKeyboardShortcuts({ targetRef, onEnter }) {
  useEffect(() => {
    if (!targetRef?.current || !onEnter) {
      return;
    }

    const element = targetRef.current;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (document.activeElement && element.contains(document.activeElement)) {
          e.preventDefault();
          onEnter?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetRef, onEnter]);
}