import React from 'react';

type Props = {
  children: React.ReactNode;
  classes?: string;
  onClick?: () => void;
};

const Button = (props: Props) => {
  return (
    <button
      className={`flex items-center justify-center h-[44px] bg-gray-300 px-4 py-2 rounded-lg leading-none dark:bg-gray-600 ${props.classes}`}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
