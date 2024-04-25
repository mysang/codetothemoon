import { useState, useEffect } from 'react';
import Moon from './icons/Moon';
import Sun from './icons/Sun';
import Button from './Button';
import { getTheme } from '../utils/helpers';
import { setThemeStore } from '../stores/themeStore';

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
    <Button onClick={handleClick}>
      {theme === 'light' ? <Sun /> : <Moon />}
      {theme === 'light' ? <span className="ms-1">Dark</span> : <span className="ms-1">Light</span>}
    </Button>
  );
};

export default ThemeToggle;
