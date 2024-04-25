export const closeDropdown = (e: any, mainId: string, dropdownId: string) => {
  let parentDropdown = e.target;
  let els = [];

  if (parentDropdown) {
    while (parentDropdown) {
      els.unshift(parentDropdown);
      parentDropdown = parentDropdown.parentNode as HTMLElement | null;
      if (els.length > 4) {
        break;
      }
    }
  }

  const currentDropdown = document.getElementById(mainId);
  let isOutside = true;

  if (currentDropdown && els.length > 0) {
    els.forEach((el) => {
      if (currentDropdown == el) {
        isOutside = false;
      }
    });
  }

  if (isOutside) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }
};
