import { useStore } from '@nanostores/react';
import React, { useEffect, useState } from 'react';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';
import { colorStore, getColorStore, setColorStore } from '../stores/colorStore';
import { getThemeStore, themeStore } from '../stores/themeStore';
import Dropdown from './Dropdown';

type Color = {
  label: string;
  value: string;
};

const mainId = 'choose-colors';
const buttonId = 'colors-button';
const dropdownId = 'colors-dropdown';

const TimeColor = () => {
  const colorList = {
    dark: DARK_COLORS,
    light: LIGHT_COLORS,
  };

  const [theme] = useStore(themeStore);
  useStore(colorStore);

  const [colors, setColors] = useState(colorList[getThemeStore() as keyof typeof colorList]);

  const changeColor = (color: Color) => {
    setColorStore(color.value);
    document.documentElement.style.setProperty('--time-color', color.value);
    localStorage.setItem('color', color.value);
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    setColors(colorList[getThemeStore() as keyof typeof colorList]);
    const localColor = localStorage.getItem('color') ?? colors[0].value;

    const isValidColor = colors.some((colorObj) => colorObj.value === localColor);
    const localColorValue = isValidColor ? localColor : colors[0].value;

    let colorObj = colors.find((color) => color.value === localColorValue) ?? colors[0];

    document.documentElement.style.setProperty('--time-color', colorObj.value);
    localStorage.setItem('color', colorObj.value);
    setColorStore(colorObj.value);
  }, [colors, theme]);

  return (
    <Dropdown
      text={`Text Color: ${colors.find((colorObj) => colorObj.value === getColorStore())?.label ?? colors[0].label}`}
      mainId={mainId}
      buttonId={buttonId}
      dropdownId={dropdownId}
    >
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          className={`flex justify-start items-center block w-full px-4 py-1.5 hover:bg-gray-400 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none ${
            getColorStore() == color.value ? 'dropdown-item-active' : ''
          }`}
          role="menuitem"
          tabIndex={-1}
          onClick={() => changeColor(color)}
        >
          <span
            className="block rounded-sm me-2 w-[50px] h-[20px]"
            style={{ backgroundColor: color.value.toLowerCase() }}
          ></span>
          <span>{color.label}</span>
        </button>
      ))}
    </Dropdown>
  );
};

export default TimeColor;
