import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './index';

type Language = 'en' | 'es' | 'pt';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';

export const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
  { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português' },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && ['en', 'es', 'pt'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage as Language);
        i18n.locale = savedLanguage;
      } else {
        // Default to English
        setCurrentLanguage('en');
        i18n.locale = 'en';
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
      setCurrentLanguage('en');
      i18n.locale = 'en';
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
      i18n.locale = language;
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
