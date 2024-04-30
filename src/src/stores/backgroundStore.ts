import { atom } from 'nanostores';

export const backgroundStore = atom('#FFFFFF');

export function setBackgroundStore(background: string) {
  backgroundStore.set(background);
}

export function getBackgroundStore(): string {
  return backgroundStore.get();
}
