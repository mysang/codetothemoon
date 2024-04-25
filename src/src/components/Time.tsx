import moment from 'moment';
import 'moment-timezone';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { TIMEZONES } from '../constants/timezones';
import TimeText from './TimeText';

import '../styles/select.css';

const Time = () => {
  const defaultTimezone = { value: 'Asia/Ho_Chi_Minh', label: '(GMT+07:00) Ho Chi Minh' };

  const [timezone, setTimeZone] = useState(defaultTimezone);

  const [time, setTime] = useState(moment().format('HH:mm:ss'));

  const handleOnChange = (selectedOption: any) => {
    setTimeZone(selectedOption);
    localStorage.setItem('timezone', selectedOption.value);
    moment.tz.setDefault(selectedOption.value);
  };

  useEffect(() => {
    const localTimezone = localStorage.getItem('timezone') ?? moment.tz.guess();
    const findTimezone = TIMEZONES.find((timezone) => timezone.value === localTimezone);
    const currentTimezone = findTimezone ?? defaultTimezone;

    setTimeZone(currentTimezone);
    localStorage.setItem('timezone', currentTimezone.value);
    moment.tz.setDefault(currentTimezone.value);

    setInterval(() => {
      setTime(moment().format('HH:mm:ss'));
    }, 1000);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div>
        <TimeText>{time}</TimeText>
      </div>
      <div>
        <Select
          className="react-select-container"
          value={timezone}
          onChange={handleOnChange}
          options={TIMEZONES}
          isSearchable={true}
        />
      </div>
    </div>
  );
};

export default Time;
