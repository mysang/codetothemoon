import moment from 'moment';
import 'moment-timezone';
import React, { useEffect, useState } from 'react';
import '../styles/select.css';
import TimeText from './TimeText';

const Time = () => {
  const [time, setTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    setInterval(() => {
      setTime(moment().format('HH:mm:ss'));
    }, 1000);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <TimeText>{time}</TimeText>
    </div>
  );
};

export default Time;
