import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'starfield' | 'neon' | 'forest' | 'crimson' | 'royal' | 'solar-light' | 'cyber-dark';

interface ThemeColors {
  type: 'dark' | 'light';
  bg: string;
  card: string;
  accent: string;
  glow: string;
  text: string;
  secondary: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  starfield: {
    type: 'dark',
    bg: '#000000',
    card: '#111111',
    accent: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.5)',
    text: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.4)',
  },
  neon: {
    type: 'dark',
    bg: '#050505',
    card: '#0a0a0a',
    accent: '#00F2FF',
    glow: 'rgba(0, 242, 255, 0.6)',
    text: '#FFFFFF',
    secondary: 'rgba(242, 0, 255, 0.5)',
  },
  forest: {
    type: 'dark',
    bg: '#050a05',
    card: '#0a1a0a',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.5)',
    text: '#f0fdf4',
    secondary: '#eab308',
  },
  crimson: {
    type: 'dark',
    bg: '#0a0000',
    card: '#1a0505',
    accent: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)',
    text: '#fef2f2',
    secondary: '#f97316',
  },
  royal: {
    type: 'dark',
    bg: '#0a0510',
    card: '#150a20',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    text: '#faf5ff',
    secondary: '#eab308',
  },
  'solar-light': {
    type: 'light',
    bg: '#F9FAFB', // Cool grey white
    card: '#FFFFFF', // Pure white
    accent: '#F59E0B', // Amber/Solar
    glow: 'rgba(245, 158, 11, 0.3)',
    text: '#111827', // Obsidian dark text
    secondary: '#818CF8', // Indigo/Purple
  },
  'cyber-dark': {
    type: 'dark',
    bg: '#020005', // Deep space purple
    card: '#0A0515', // Dark magenta/purple
    accent: '#FF00FF', // Neo Magenta
    glow: 'rgba(255, 0, 255, 0.6)',
    text: '#FFFFFF',
    secondary: '#00FFFF', // Electric Blue
  },
};

interface ThemeContextType {
  activeTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode; initialTheme?: ThemeType }> = ({ 
  children, 
  initialTheme = 'starfield' 
}) => {
  const [activeTheme, setActiveTheme] = useState<ThemeType>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[activeTheme];
    
    root.style.setProperty('--forge-bg', colors.bg);
    root.style.setProperty('--forge-card', colors.card);
    root.style.setProperty('--forge-accent', colors.accent);
    root.style.setProperty('--forge-glow', colors.glow);
    root.style.setProperty('--forge-text', colors.text);
    root.style.setProperty('--forge-secondary', colors.secondary);
    
    // Manage root classes
    root.className = `theme-${activeTheme} theme-${colors.type}`;
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme: setActiveTheme, colors: themes[activeTheme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
