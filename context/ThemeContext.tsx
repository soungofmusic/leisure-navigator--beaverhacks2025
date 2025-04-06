'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with system preference or default to light if not available
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for user preference in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // If no stored preference, check system preference
    if (!storedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to HTML element
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light-mode', 'dark-mode');
    
    // Add the correct class
    root.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    
    // If dark mode, add the .dark class that Tailwind uses for dark variants
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
