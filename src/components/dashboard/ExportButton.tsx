"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const download = async (format: "csv" | "pdf") => {
    setOpen(false);
    const res = await fetch(`/api/export?format=${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "csv" ? "movement-logs.csv" : "movement-logs.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
      >
        <Icon name="download" className="text-base" />
        Export
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50">
          <button
            type="button"
            onClick={() => download("csv")}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Icon name="description" className="text-base text-slate-400" />
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => download("pdf")}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Icon name="picture_as_pdf" className="text-base text-slate-400" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
