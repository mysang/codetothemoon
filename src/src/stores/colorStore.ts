import { atom } from 'nanostores';

export const colorStore = atom('#FFFFFF');

export function setColorStore(color: string) {
  colorStore.set(color);
}

export function getColorStore(): string {
  return colorStore.get();
}
