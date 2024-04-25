import { atom } from 'nanostores';

export const fontStore = atom('IBM Plex Mono');

export function setFontStore(font: string) {
  fontStore.set(font);
}

export function getFontStore(): string {
  return fontStore.get();
}
