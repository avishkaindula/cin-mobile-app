import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type ColorScheme = 'light';

interface ThemeContextType {
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme: setNativeWindColorScheme } = useNativeWindColorScheme();

  // Always set to light mode on mount
  useEffect(() => {
    setNativeWindColorScheme('light');
  }, []);

  const value: ThemeContextType = {
    colorScheme: 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
