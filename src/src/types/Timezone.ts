import type { SingleValue } from 'react-select';

export type Timezone = {
  value: string;
  label: string;
};

export type SingleValueTimezone = SingleValue<Timezone>;
