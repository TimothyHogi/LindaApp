import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, sw: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>("en");
  const updateLanguageMutation = trpc.auth.updateLanguage.useMutation();

  // Load user's preferred language from user data
  useEffect(() => {
    if (user?.preferredLanguage) {
      setLanguageState(user.preferredLanguage as Language);
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to backend if user is logged in
    if (user) {
      updateLanguageMutation.mutate({ language: lang });
    }
    // Also save to localStorage for non-logged-in users
    localStorage.setItem("linda-language", lang);
  };

  // Translation helper
  const t = (en: string, sw: string) => {
    return language === "sw" ? sw : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
