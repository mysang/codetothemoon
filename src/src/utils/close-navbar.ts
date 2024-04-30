export const closeNavbar = (e: any) => {
  let parentNavbar = e.target;
  let els = [];

  if (parentNavbar) {
    while (parentNavbar) {
      els.unshift(parentNavbar);
      parentNavbar = parentNavbar.parentNode as HTMLElement | null;
      if (els.length > 10) {
        break;
      }
    }
  }

  const currentNavbar = document.getElementById('navbar');
  let isOutside = true;

  if (currentNavbar && els.length > 0) {
    els.forEach((el) => {
      if (
        currentNavbar == el ||
        el.id === 'navbar-toggle' ||
        (typeof el.classList !== 'undefined' && el.classList.contains('css-1nmdiq5-menu'))
      ) {
        isOutside = false;
      }
    });

    if (isOutside) {
      currentNavbar.classList.remove('active');
    }
  }
};
