import React, { useEffect } from 'react';
import { closeNavbar } from '../utils/close-navbar';
import ThemeMode from './ThemeMode';
import TimeBackground from './TimeBackground';
import TimeColor from './TimeColor';
import TimeFont from './TimeFont';
import TimeSize from './TimeSize';
import Timezone from './Timezone';
import Bars from './icons/Bars';

const Menu = () => {
  const handleClick = () => {
    document.getElementById('navbar')?.classList.toggle('active');
  };

  useEffect(() => {
    document.addEventListener('click', (e) => {
      closeNavbar(e);
    });
  }, []);

  return (
    <div>
      <button
        type="button"
        id="navbar-toggle"
        className="flex items-center justify-center h-[44px] rounded-lg px-4 py-2 bg-gray-300 dark:bg-gray-600"
        onClick={handleClick}
        aria-expanded="true"
        aria-haspopup="true"
      >
        <Bars />
      </button>

      <div id="navbar" className="fixed top-[4.7rem] right-[1rem] bg-gray-200 dark:bg-slate-800 rounded-lg p-4">
        <div className="flex flex-col">
          <div className="mb-2 w-full">
            <ThemeMode />
          </div>
          <div className="mb-2 w-full">
            <Timezone />
          </div>
          <div className="mb-2 w-full">
            <TimeFont />
          </div>
          <div className="mb-2 w-full">
            <TimeSize />
          </div>
          <div className="mb-2 w-full">
            <TimeColor />
          </div>
          <div className="w-full">
            <TimeBackground />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
