import React, { useEffect, useState } from 'react';
import { setThemeStore } from '../stores/themeStore';
import { getTheme } from '../utils/helpers';
import Button from './Button';
import Moon from './icons/Moon';
import Sun from './icons/Sun';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getTheme());

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
    setThemeStore(theme);
  }, [theme]);

  return (
    <Button onClick={handleClick} classes="w-full">
      {theme === 'light' ? <Sun /> : <Moon />}
      <span className="ms-1">Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
    </Button>
  );
};

export default ThemeToggle;
