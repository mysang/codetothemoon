import { atom } from 'nanostores';

export const themeStore = atom('dark');

export function setThemeStore(title: string) {
  themeStore.set(title);
}

export function getThemeStore() {
  return themeStore.get();
}
