import { useStore } from '@nanostores/react';
import React, { useEffect } from 'react';
import { FONTS } from '../constants/fonts';
import { fontStore, getFontStore, setFontStore } from '../stores/fontStore';
import Dropdown from './Dropdown';
import AtSymbol from './icons/AtSymbol';

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
    const localFont = localStorage.getItem('font') ?? 'ds_digital';
    const isValidFont = FONTS.some((fontObj) => fontObj.value === localFont);
    const localFontValue = isValidFont ? localFont : 'ds_digital';

    localStorage.setItem('font', localFontValue);
    setFontStore(localFontValue);
  }, [font]);

  return (
    <Dropdown text={`Font: ${FONTS.find((fontObj) => fontObj.value === getFontStore())?.label ?? 'DS_Digital'}`} mainId={mainId} buttonId={buttonId} dropdownId={dropdownId} icon={<AtSymbol />}>
      {FONTS.map((fontObj) => (
        <button
          key={fontObj.value}
          type="button"
          className={`flex justify-start items-center block w-full px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none ${getFontStore() == fontObj.value ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
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
