import React from "react";

export function ReadingProgressBar({ progress, theme }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full transition-all duration-150 ease-out ${
          theme === "dark"
            ? "bg-amber-200/90 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
            : theme === "sepia"
            ? "bg-amber-900/80"
            : "bg-neutral-900"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
