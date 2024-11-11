// i18n.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import zh from "./zh.json";
import en from "./en.json";
import { Messages } from "./types";

interface I18nContextProps {
  t: (key: keyof Messages) => string;
  switchLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

const languages: Record<string, Messages> = { zh, en };

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>("zh");

  const t = (key: keyof Messages) => languages[language][key] || key;

  const switchLanguage = (lang: string) => {
    if (languages[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <I18nContext.Provider value={{ t, switchLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextProps => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a I18nProvider");
  }
  return context;
};
