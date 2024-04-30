import { useStore } from '@nanostores/react';
import React, { useEffect } from 'react';
import { SIZES } from '../constants/sizes';
import { getSizeStore, setSizeStore, sizeStore } from '../stores/sizeStore';
import Dropdown from './Dropdown';

const mainId = 'choose-sizes';
const buttonId = 'sizes-button';
const dropdownId = 'sizes-dropdown';

const TimeSize = () => {
  const [size] = useStore(sizeStore);

  const changeSize = (localSize: string) => {
    localStorage.setItem('size', localSize);
    setSizeStore(localSize);

    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  useEffect(() => {
    const localSize = localStorage.getItem('size') ?? '10rem';
    const isValidSize = SIZES.some((sizeObj) => sizeObj.value === localSize);
    const localSizeValue = isValidSize ? localSize : '10rem';

    localStorage.setItem('size', localSizeValue);
    setSizeStore(localSizeValue);
  }, [size]);

  return (
    <Dropdown
      text={`Font Size: ${SIZES.find((sizeObj) => sizeObj.value === getSizeStore())?.label ?? '10X'}`}
      mainId={mainId}
      buttonId={buttonId}
      dropdownId={dropdownId}
    >
      {SIZES.map((sizeObj) => (
        <button
          key={sizeObj.value}
          type="button"
          className={`flex justify-start items-center block w-full px-4 py-1 hover:bg-gray-400 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:outline-none ${
            getSizeStore() == sizeObj.value ? 'dropdown-item-active' : ''
          }`}
          role="menuitem"
          tabIndex={-1}
          onClick={() => changeSize(sizeObj.value)}
        >
          <span>{sizeObj.label}</span>
        </button>
      ))}
    </Dropdown>
  );
};

export default TimeSize;
