import { atom } from 'nanostores';

export const sizeStore = atom('IBM Plex Mono');

export function setSizeStore(size: string) {
  sizeStore.set(size);
}

export function getSizeStore(): string {
  return sizeStore.get();
}
