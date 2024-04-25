import { atom } from 'nanostores';

export const colorLabelStore = atom('White');

export function setColorLabelStore(color: string) {
  colorLabelStore.set(color);
}

export function getColorLabelStore(): string {
  return colorLabelStore.get();
}
