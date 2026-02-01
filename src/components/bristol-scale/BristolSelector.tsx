"use client";

import { useState } from "react";

interface BristolSelectorProps {
  value: number | null;
  onChange: (type: number) => void;
}

const stoolTypes = [
  {
    type: 1,
    label: "Type 1",
    status: "Very Constipated",
    description: "Separate hard lumps, like nuts (hard to pass)",
    visual: (
      <div className="flex gap-1 flex-wrap justify-center w-12">
        <div className="w-3 h-3 bg-stool-brown rounded-full"></div>
        <div className="w-2 h-2 bg-stool-brown rounded-full"></div>
        <div className="w-3 h-3 bg-stool-brown rounded-full"></div>
        <div className="w-2 h-3 bg-stool-brown rounded-full"></div>
      </div>
    ),
  },
  {
    type: 2,
    label: "Type 2",
    status: "Slightly Constipated",
    description: "Sausage-shaped but lumpy",
    visual: (
      <div className="w-16 h-8 bg-stool-brown rounded-full border-4 border-stool-brown/30 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap gap-0.5">
          <div className="w-4 h-4 bg-stool-brown border border-black/10 rounded-full"></div>
          <div className="w-4 h-4 bg-stool-brown border border-black/10 rounded-full"></div>
          <div className="w-4 h-4 bg-stool-brown border border-black/10 rounded-full"></div>
          <div className="w-4 h-4 bg-stool-brown border border-black/10 rounded-full"></div>
        </div>
      </div>
    ),
  },
  {
    type: 3,
    label: "Type 3",
    status: "Normal",
    description: "Like a sausage but with cracks on its surface",
    visual: (
      <div className="w-20 h-6 bg-stool-brown rounded-full relative">
        <div className="absolute inset-2 border-b border-black/20"></div>
        <div className="absolute top-1 left-4 w-4 h-0.5 bg-black/10"></div>
      </div>
    ),
  },
  {
    type: 4,
    label: "Type 4",
    status: "Normal",
    description: "Like a sausage or snake, smooth and soft",
    visual: <div className="w-20 h-5 bg-stool-brown rounded-full shadow-inner"></div>,
  },
  {
    type: 5,
    label: "Type 5",
    status: "Lacking Fiber",
    description: "Soft blobs with clear-cut edges (passed easily)",
    visual: (
      <div className="flex gap-2">
        <div className="w-6 h-6 bg-stool-brown rounded-lg"></div>
        <div className="w-8 h-8 bg-stool-brown rounded-lg"></div>
        <div className="w-4 h-4 bg-stool-brown rounded-lg mt-4"></div>
      </div>
    ),
  },
  {
    type: 6,
    label: "Type 6",
    status: "Inflammation",
    description: "Fluffy pieces with ragged edges, a mushy stool",
    visual: (
      <div className="w-16 h-10 bg-stool-brown/80 blur-[1px] rounded-full relative">
        <div className="absolute -top-1 left-2 w-4 h-4 bg-stool-brown/80 rounded-full"></div>
        <div className="absolute -bottom-1 right-2 w-6 h-4 bg-stool-brown/80 rounded-full"></div>
      </div>
    ),
  },
  {
    type: 7,
    label: "Type 7",
    status: "Diarrhea",
    description: "Watery, no solid pieces. Entirely liquid",
    visual: (
      <div className="w-20 h-12 bg-stool-brown/60 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stool-brown to-transparent opacity-50"></div>
      </div>
    ),
  },
];

export function BristolSelector({ value, onChange }: BristolSelectorProps) {
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  const selectedDescription =
    stoolTypes.find((s) => s.type === value)?.description ||
    "Select a stool type above";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold font-display">Bristol Stool Type</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
          Select One
        </span>
      </div>

      {/* Horizontal scrolling selector */}
      <div className="flex overflow-x-auto gap-4 pb-6 pt-2 no-scrollbar snap-x">
        {stoolTypes.map((stool) => (
          <button
            key={stool.type}
            type="button"
            onClick={() => onChange(stool.type)}
            onMouseEnter={() => setHoveredType(stool.type)}
            onMouseLeave={() => setHoveredType(null)}
            className={`stool-card snap-center flex-shrink-0 w-44 p-6 rounded-2xl border flex flex-col items-center text-center transition-all duration-200 cursor-pointer hover:-translate-y-1 ${
              value === stool.type
                ? "ring-4 ring-primary bg-white dark:bg-slate-800 shadow-xl border-primary/20"
                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="h-20 flex items-center justify-center mb-4">
              {stool.visual}
            </div>
            <span className="font-bold text-lg">{stool.label}</span>
            <p className="text-xs mt-1 text-slate-500 uppercase">{stool.status}</p>
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="text-center mt-2 h-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          {hoveredType
            ? stoolTypes.find((s) => s.type === hoveredType)?.description
            : selectedDescription}
        </p>
      </div>
    </div>
  );
}
