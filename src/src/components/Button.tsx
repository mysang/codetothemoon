import type React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

const Button = (props: Props) => {
  return (
    <button
      className="flex items-center justify-center h-[44px] bg-gray-200 px-4 py-2 rounded-lg leading-none dark:bg-gray-600"
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
