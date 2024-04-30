import React, { useEffect } from 'react';
import { closeDropdown } from '../utils/close-dropdown';
import ChevronDown from './icons/ChevronDown';

type Props = {
  text: string;
  mainId: string;
  buttonId: string;
  dropdownId: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Dropdown = (props: Props) => {
  const handleClick = () => {
    const dropdown = document.getElementById(props.dropdownId);
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  };

  useEffect(() => {
    document.addEventListener('click', (e) => {
      closeDropdown(e, props.mainId, props.dropdownId);
    });
  }, []);

  return (
    <div className="relative inline-block text-left w-full" id={props.mainId}>
      <button
        type="button"
        id={props.buttonId}
        className="flex items-center justify-between h-[44px] w-full rounded-lg px-2 pe-2 ps-[0.8rem] bg-gray-300 dark:bg-gray-600"
        onClick={handleClick}
        aria-expanded="true"
        aria-haspopup="true"
      >
        <div className="flex items-center">
          {props.icon && <span className="me-1">{props.icon}</span>}
          <span className="me-1">{props.text}</span>
        </div>
        <ChevronDown classes="h-5 w-5" />
      </button>

      <div
        id={props.dropdownId}
        className="hidden absolute right-0 left-0 w-full z-[99999] mt-2 mw-56 origin-top-right rounded-md focus:outline-none bg-gray-300 dark:bg-gray-600 max-h-[555px] max-sm:max-h-[255px] overflow-y-auto"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={props.buttonId}
        tabIndex={-1}
      >
        <div className="py-1.5" role="none">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
