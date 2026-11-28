"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: (event?: { clientX?: number; clientY?: number; target?: unknown }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "sarpanah_theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
  }
  return "system";
}

function getInitialResolved(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    if (document.documentElement.classList.contains("dark")) return "dark";
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "dark") return "dark";
    if (stored === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(getInitialResolved);

  const applyThemeToDOM = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = newTheme === "dark" || (newTheme === "system" && systemDark);

    if (isDark) {
      root.classList.add("dark");
      setResolvedTheme("dark");
    } else {
      root.classList.remove("dark");
      setResolvedTheme("light");
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const isDark = e.matches;
        if (isDark) {
          document.documentElement.classList.add("dark");
          setResolvedTheme("dark");
        } else {
          document.documentElement.classList.remove("dark");
          setResolvedTheme("light");
        }
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyThemeToDOM(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
      }
    },
    [applyThemeToDOM]
  );

  const toggleTheme = useCallback(
    (event?: { clientX?: number; clientY?: number; target?: unknown }) => {
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

      if (typeof window === "undefined" || typeof document === "undefined") {
        setTheme(nextTheme);
        return;
      }

      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!("startViewTransition" in document) || isReducedMotion) {
        document.documentElement.classList.add("theme-transitioning");
        setTheme(nextTheme);
        window.setTimeout(() => {
          document.documentElement.classList.remove("theme-transitioning");
        }, 450);
        return;
      }

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (
        event &&
        typeof event.clientX === "number" &&
        typeof event.clientY === "number" &&
        (event.clientX > 0 || event.clientY > 0)
      ) {
        x = event.clientX;
        y = event.clientY;
      } else if (
        event &&
        event.target &&
        typeof (event.target as HTMLElement).getBoundingClientRect === "function"
      ) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
