import { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import Cog from './icons/Cog';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';
import { getTheme } from '../utils/helpers';
import { getThemeStore, themeStore } from '../stores/themeStore';
import { useStore } from '@nanostores/react';
import { colorLabelStore, getColorLabelStore, setColorLabelStore } from '../stores/colorLabelStore';

type Props = {};
type Color = {
  label: string;
  value: string;
};

const mainId = 'choose-colors';
const buttonId = 'colors-button';
const dropdownId = 'colors-dropdown';

const TimeColor = (props: Props) => {
  const colorList = {
    dark: DARK_COLORS,
    light: LIGHT_COLORS,
  };

  const [theme] = useStore(themeStore);
  useStore(colorLabelStore);

  const [colors, setColors] = useState(colorList[getThemeStore() as keyof typeof colorList]);

  const changeColor = (color: Color) => {
    setColorLabelStore(color.label);
    document.documentElement.style.setProperty('--time-color', color.value);
    localStorage.setItem('color', JSON.stringify(color));
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    setColors(colorList[getThemeStore() as keyof typeof colorList]);
    const localColor = localStorage.getItem('color');
    let colorObj = colors[0];

    if (localColor) {
      const parsedColor = JSON.parse(localColor);
      const isValidColor = colors.some((color) => color.value === parsedColor.value);
      if (isValidColor) {
        colorObj = parsedColor;
      }
    }

    document.documentElement.style.setProperty('--time-color', colorObj.value);
    localStorage.setItem('color', JSON.stringify(colorObj));
    setColorLabelStore(colorObj.label);
  }, [colors, theme]);

  return (
    <Dropdown text={getColorLabelStore()} mainId={mainId} buttonId={buttonId} dropdownId={dropdownId} icon={<Cog />}>
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          className="flex justify-start items-center block w-full px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none"
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
