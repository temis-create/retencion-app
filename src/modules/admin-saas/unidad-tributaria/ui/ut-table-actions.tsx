"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { UTForm } from "./ut-form";

export function UTTableActions() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Nueva UT
      </button>

      {showForm && <UTForm onClose={() => setShowForm(false)} />}
    </>
  );
}
