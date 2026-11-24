"use client";

import React from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CompareProvider } from "@/components/site/CompareContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { UserAuthProvider } from "@/components/providers/UserAuthProvider";
import type { ProvidersProps } from "./types";

export function Providers({ children }: ProvidersProps) {
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
