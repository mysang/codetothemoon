import type React from 'react';
import ChevronDown from './icons/ChevronDown';
import { useEffect } from 'react';
import { closeDropdown } from '../utils/close-dropdown';

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
    <div className="relative inline-block text-left" id={props.mainId}>
      <button
        type="button"
        id={props.buttonId}
        className="flex items-center justify-center h-[44px] rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-600"
        onClick={handleClick}
        aria-expanded="true"
        aria-haspopup="true"
      >
        {props.icon && <span className="me-2">{props.icon}</span>}
        <span className="me-2">{props.text}</span>
        <ChevronDown classes="h-5 w-5" />
      </button>

      <div
        id={props.dropdownId}
        className="hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md focus:outline-none bg-gray-200 dark:bg-gray-600"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={props.buttonId}
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
