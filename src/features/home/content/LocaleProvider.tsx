"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "./model";

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "tr", setLocale: () => {} });
const STORAGE_KEY = "toprak-tarim-locale";

export const useHomeLocale = () => useContext(LocaleContext);
export default function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try { window.localStorage.setItem(STORAGE_KEY, nextLocale); } catch { /* Storage can be unavailable in private contexts. */ }
  }, []);

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
