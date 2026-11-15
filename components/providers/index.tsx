"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { CompareProvider } from "@/components/site/CompareContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <CompareProvider>{children}</CompareProvider>
    </QueryProvider>
  );
}

export default Providers;
