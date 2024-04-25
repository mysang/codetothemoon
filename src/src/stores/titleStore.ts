import { atom } from 'nanostores';

export const titleStore = atom('Online Timer - Countdown - Xtimer');

export function setTitleStore(title: string) {
  titleStore.set(title);
}

export function getTitleStore() {
  return titleStore.get();
}
