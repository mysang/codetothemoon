export function getTheme() {
  if (typeof localStorage !== 'undefined') {
    const localTheme = localStorage.getItem('theme');
    if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
      return localTheme;
    }
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
}
