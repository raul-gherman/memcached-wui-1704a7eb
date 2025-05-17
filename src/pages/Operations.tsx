
import React from "react";
import { ImportExport } from "@/components/operations/ImportExport";
import { FlushAll } from "@/components/operations/FlushAll";

export default function Operations() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Operations</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ImportExport />
        <FlushAll />
      </div>
    </div>
  );
}
