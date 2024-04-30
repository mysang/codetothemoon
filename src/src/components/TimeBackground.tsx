import { useStore } from '@nanostores/react';
import React, { useEffect, useState } from 'react';
import { DARK_BACKGROUNDS, LIGHT_BACKGROUNDS } from '../constants/backgrounds';
import { backgroundStore, getBackgroundStore, setBackgroundStore } from '../stores/backgroundStore';
import { getThemeStore, themeStore } from '../stores/themeStore';
import Dropdown from './Dropdown';

type Background = {
  label: string;
  value: string;
};

const mainId = 'choose-backgrounds';
const buttonId = 'backgrounds-button';
const dropdownId = 'backgrounds-dropdown';

const TimeBackground = () => {
  const backgroundList = {
    dark: DARK_BACKGROUNDS,
    light: LIGHT_BACKGROUNDS,
  };

  const [theme] = useStore(themeStore);
  useStore(backgroundStore);

  const [backgrounds, setBackgrounds] = useState(backgroundList[getThemeStore() as keyof typeof backgroundList]);

  const changeBackground = (background: Background) => {
    setBackgroundStore(background.value);
    document.documentElement.style.setProperty('--time-background', background.value);
    document.body.style.setProperty('background-color', background.value);
    localStorage.setItem('background', background.value);
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    setBackgrounds(backgroundList[getThemeStore() as keyof typeof backgroundList]);
    const localBackground = localStorage.getItem('background') ?? backgrounds[0].value;

    const isValidBackground = backgrounds.some((backgroundObj) => backgroundObj.value === localBackground);
    const localBackgroundValue = isValidBackground ? localBackground : backgrounds[0].value;

    let backgroundObj = backgrounds.find((background) => background.value === localBackgroundValue) ?? backgrounds[0];

    document.documentElement.style.setProperty('--time-background', backgroundObj.value);
    document.body.style.setProperty('background-color', backgroundObj.value);
    localStorage.setItem('background', backgroundObj.value);
    setBackgroundStore(backgroundObj.value);
  }, [backgrounds, theme]);

  return (
    <Dropdown
      text={`Background Color: ${
        backgrounds.find((backgroundObj) => backgroundObj.value === getBackgroundStore())?.label ?? backgrounds[0].label
      }`}
      mainId={mainId}
      buttonId={buttonId}
      dropdownId={dropdownId}
    >
      {backgrounds.map((background) => (
        <button
          key={background.value}
          type="button"
          className={`flex justify-start items-center block w-full px-4 py-1.5 hover:bg-gray-400 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none ${
            getBackgroundStore() == background.value ? 'dropdown-item-active' : ''
          }`}
          role="menuitem"
          tabIndex={-1}
          onClick={() => changeBackground(background)}
        >
          <span
            className="block rounded-sm me-2 w-[50px] h-[20px]"
            style={{ backgroundColor: background.value.toLowerCase() }}
          ></span>
          <span>{background.label}</span>
        </button>
      ))}
    </Dropdown>
  );
};

export default TimeBackground;
