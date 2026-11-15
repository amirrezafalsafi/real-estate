"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { CompareProvider } from "@/components/site/CompareContext";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <CompareProvider>{children}</CompareProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default Providers;
