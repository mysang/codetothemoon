import moment from 'moment';
import 'moment-timezone';
import { useEffect, useState } from 'react';
import Select, { components, type DropdownIndicatorProps } from 'react-select';
import { TIMEZONES } from '../constants/timezones';

import React from 'react';
import '../styles/select.css';
import ChevronDown from './icons/ChevronDown';

const DropdownIndicator = (
  props: DropdownIndicatorProps<{ value: string; label: string; }>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown />
    </components.DropdownIndicator>
  );
};

const Timezone = () => {
  const defaultTimezone = { value: 'Asia/Ho_Chi_Minh', label: '(GMT+07:00) Ho Chi Minh' };

  const [timezone, setTimeZone] = useState(defaultTimezone);

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
  }, []);

  return (
    <Select
      components={{ DropdownIndicator }}
      className="react-select-container"
      value={timezone}
      onChange={handleOnChange}
      options={TIMEZONES}
      isSearchable={true}
    />
  );
};

export default Timezone;
