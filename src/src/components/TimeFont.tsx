import { useEffect } from 'react';
import Dropdown from './Dropdown';
import Cog from './icons/Cog';
import { FONTS } from '../constants/fonts';
import { useStore } from '@nanostores/react';
import { fontStore, getFontStore, setFontStore } from '../stores/fontStore';
import AtSymbol from './icons/AtSymbol';

type Props = {};

const mainId = 'choose-fonts';
const buttonId = 'fonts-button';
const dropdownId = 'fonts-dropdown';

const TimeFont = (props: Props) => {
  const [font] = useStore(fontStore);

  const changeFont = (localFont: string) => {
    document.documentElement.style.setProperty('--time-font', `'${localFont}', sans-serif`);
    localStorage.setItem('font', localFont);
    setFontStore(localFont);

    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    const localFont = localStorage.getItem('font') ?? 'DS Digital';
    document.documentElement.style.setProperty('--time-font', `'${localFont}', sans-serif`);
    localStorage.setItem('font', localFont);
    setFontStore(localFont);
  }, [font]);

  return (
    <Dropdown text={getFontStore()} mainId={mainId} buttonId={buttonId} dropdownId={dropdownId} icon={<AtSymbol />}>
      {FONTS.map((fontStr) => (
        <button
          key={fontStr}
          type="button"
          className="flex justify-start items-center block w-full px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none"
          role="menuitem"
          tabIndex={-1}
          onClick={() => changeFont(fontStr)}
        >
          <span>{fontStr}</span>
        </button>
      ))}
    </Dropdown>
  );
};

export default TimeFont;
