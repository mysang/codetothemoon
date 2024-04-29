import { useStore } from '@nanostores/react';
import React, { useEffect } from 'react';
import { fontStore, getFontStore } from '../stores/fontStore';

type Props = {
  children?: React.ReactNode;
};

const TimeText = (props: Props) => {
  useStore(fontStore);

  useEffect(() => {
    const timeText = document.getElementById('time_text');
    if (timeText) {
      console.log(timeText.clientWidth);
    }
  }, []);
  
  return <>
    <h3 id="time_text" className={`text-start relative text-[100px] leading-none text-[var(--time-color)] font-${getFontStore()}`}>
      <span className="absolute w-full left-0 right-0">{props.children}</span>
      <span className="sr_only">00:00:00</span>
    </h3>
  </>;
};

export default TimeText;
