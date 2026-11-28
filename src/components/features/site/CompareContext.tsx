"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface CompareItem {
  id: string;
  title: string;
  listingType?: string;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  image?: string;
  city?: string;
}

interface CompareContextType {
  compareItems: CompareItem[];
  compareIds: string[];
  isMounted: boolean;
  addToCompare: (item: CompareItem | string) => boolean;
  removeFromCompare: (id: string) => void;
  toggleCompare: (item: CompareItem | string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  limitWarning: string | null;
  dismissWarning: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "sarpanah_compare_items_v2";
const MAX_COMPARE_ITEMS = 2;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function subscribeEmpty() {
  return () => {};
}

function getMountSnapshot(): boolean {
  return true;
}

function getServerMountSnapshot(): boolean {
  return false;
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const isMounted = useSyncExternalStore(
    subscribeEmpty,
    getMountSnapshot,
    getServerMountSnapshot
  );

  const rawString = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const compareItems: CompareItem[] = useMemo(() => {
    try {
      const parsed = JSON.parse(rawString);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === "string") {
              return { id: item, title: "ملک انتخاب‌شده" };
            }
            return item;
          })
          .slice(0, MAX_COMPARE_ITEMS);
      }
      return [];
    } catch {
      return [];
    }
  }, [rawString]);

  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const compareIds = useMemo(() => compareItems.map((item) => item.id), [compareItems]);

  const isInCompare = (id: string) => compareIds.includes(id);

  const saveItems = (items: CompareItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      emitChange();
    } catch {
    }
  };

  const addToCompare = (input: CompareItem | string): boolean => {
    const id = typeof input === "string" ? input : input.id;

    if (isInCompare(id)) {
      return true;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      setLimitWarning(
        "حداکثر ۲ ملک می‌توانید برای مقایسه همزمان انتخاب کنید. لطفاً ابتدا یکی را حذف نمایید."
      );
      return false;
    }

    const newItem: CompareItem =
      typeof input === "string" ? { id: input, title: "ملک انتخابی" } : input;

    saveItems([...compareItems, newItem]);
    setLimitWarning(null);
    return true;
  };

  const removeFromCompare = (id: string) => {
    saveItems(compareItems.filter((item) => item.id !== id));
  };

  const toggleCompare = (input: CompareItem | string) => {
    const id = typeof input === "string" ? input : input.id;
    if (isInCompare(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(input);
    }
  };

  const clearCompare = () => {
    saveItems([]);
    setLimitWarning(null);
  };

  const dismissWarning = () => {
    setLimitWarning(null);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareIds,
        isMounted,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        limitWarning,
        dismissWarning,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
