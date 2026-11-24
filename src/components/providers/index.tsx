"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { CompareProvider } from "@/components/site/CompareContext";
import { ThemeProvider } from "./ThemeProvider";
import { UserAuthProvider } from "./UserAuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <UserAuthProvider>
          <CompareProvider>{children}</CompareProvider>
        </UserAuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default Providers;
