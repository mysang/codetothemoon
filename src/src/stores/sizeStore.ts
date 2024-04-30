import { atom } from 'nanostores';

export const sizeStore = atom('10rem');

export function setSizeStore(size: string) {
  sizeStore.set(size);
}

export function getSizeStore(): string {
  return sizeStore.get();
}
