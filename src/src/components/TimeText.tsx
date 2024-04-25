import type React from 'react';

type Props = {
  children?: React.ReactNode;
};

const TimeText = (props: Props) => {
  return <h3 className={`text-[var(--time-color)]`}>{props.children}</h3>;
};

export default TimeText;
