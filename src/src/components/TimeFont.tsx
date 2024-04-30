import { useStore } from '@nanostores/react';
import React, { useEffect } from 'react';
import { FONTS } from '../constants/fonts';
import { fontStore, getFontStore, setFontStore } from '../stores/fontStore';
import Dropdown from './Dropdown';

const mainId = 'choose-fonts';
const buttonId = 'fonts-button';
const dropdownId = 'fonts-dropdown';

const TimeFont = () => {
  const [font] = useStore(fontStore);

  const changeFont = (localFont: string) => {
    localStorage.setItem('font', localFont);
    setFontStore(localFont);

    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    const localFont = localStorage.getItem('font') ?? 'digital_7';
    const isValidFont = FONTS.some((fontObj) => fontObj.value === localFont);
    const localFontValue = isValidFont ? localFont : 'digital_7';

    localStorage.setItem('font', localFontValue);
    setFontStore(localFontValue);
  }, [font]);

  return (
    <Dropdown
      text={`Font Family: ${FONTS.find((fontObj) => fontObj.value === getFontStore())?.label ?? 'Digital_7'}`}
      mainId={mainId}
      buttonId={buttonId}
      dropdownId={dropdownId}
    >
      {FONTS.map((fontObj) => (
        <button
          key={fontObj.value}
          type="button"
          className={`flex justify-start items-center block w-full px-4 py-1.5 hover:bg-gray-400 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none ${
            getFontStore() == fontObj.value ? 'dropdown-item-active' : ''
          }`}
          role="menuitem"
          tabIndex={-1}
          onClick={() => changeFont(fontObj.value)}
        >
          <div className="text-start whitespace-nowrap flex w-full">
            <span className="me-auto">{fontObj.label}</span>
            <span className={`ms-4 text-end font-${fontObj.value}`}>23:59:59</span>
          </div>
        </button>
      ))}
    </Dropdown>
  );
};

export default TimeFont;
