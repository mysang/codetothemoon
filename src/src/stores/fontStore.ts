import { atom } from 'nanostores';

export const fontStore = atom('digital_7');

export function setFontStore(font: string) {
  fontStore.set(font);
}

export function getFontStore(): string {
  return fontStore.get();
}
