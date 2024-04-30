import { useStore } from '@nanostores/react';
import React from 'react';
import { fontStore, getFontStore } from '../stores/fontStore';
import { getSizeStore } from '../stores/sizeStore';

type Props = {
  children?: React.ReactNode;
};

const TimeText = (props: Props) => {
  useStore(fontStore);

  return (
    <>
      <h3
        className={`text-start relative text-${getSizeStore()} leading-none text-[var(--time-color)] font-${getFontStore()}`}
      >
        <span className="absolute w-full left-0 right-0">{props.children}</span>
        <span className="sr_only">00:00:00</span>
      </h3>
    </>
  );
};

export default TimeText;
