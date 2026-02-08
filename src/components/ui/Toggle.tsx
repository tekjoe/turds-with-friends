"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, className = "", disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
          checked ? "translate-x-7 ml-0.5" : "translate-x-0 ml-1"
        }`}
      />
    </button>
  );
}
