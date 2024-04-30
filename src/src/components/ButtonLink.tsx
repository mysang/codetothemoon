import React from 'react';

type Props = {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
};

const ButtonLink = (props: Props) => {
  return (
    <a
      className="flex items-center justify-center h-[44px] bg-gray-300 px-4 py-2 rounded-lg leading-none dark:bg-gray-600"
      href={props.href}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
};

export default ButtonLink;
