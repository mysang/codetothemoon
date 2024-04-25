import type React from 'react';

type Props = {
  id: string;
  children: React.ReactNode;
  onChange?: () => void;
};

const Select = (props: Props) => {
  return (
    <select
      id={props.id}
      className="h-[44px] rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-600"
      onChange={props.onChange}
    >
      {props.children}
    </select>
  );
};

export default Select;
