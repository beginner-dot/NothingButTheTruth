"use client";

import { useState } from "react";

export function AccessibilityTools() {
  const [highContrast, setHighContrast] = useState(false);

  const toggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.dataset.contrast = next ? "high" : "default";
  };

  return (
    <button
      onClick={toggle}
      className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
      aria-pressed={highContrast}
    >
      {highContrast ? "Standard Contrast" : "High Contrast"}
    </button>
  );
}
