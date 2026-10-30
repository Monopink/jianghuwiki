'use strict';

(function () {
  const root = document.querySelector('[data-sb-bookmarks]');
  if (!root) return;

  const trigger = root.querySelector('[data-sb-toggle]');
  const popover = root.querySelector('[data-sb-popover]');
  const backdrop = root.querySelector('[data-sb-backdrop]');
  const sections = [...root.querySelectorAll('[data-sb-section]')];
  const categories = [...root.querySelectorAll('[data-sb-category]')];
  const sectionPanels = [...root.querySelectorAll('[data-sb-section-panel]')];
  const itemPanels = [...root.querySelectorAll('[data-sb-category-panel]')];
  const columns = [...root.querySelectorAll('[data-sb-level]')];
  const back = root.querySelector('[data-sb-back]');
  const closeButton = root.querySelector('[data-sb-close]');
  const hoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)');
  let portalActive = true;
  let mobileLevel = 'sections';

  document.body.appendChild(popover);
  document.body.appendChild(backdrop);

  function firstCategory(sectionId) {
    return categories.find((category) => category.dataset.sbParentSection === sectionId);
  }

  function activateCategory(categoryId) {
    categories.forEach((category) => category.classList.toggle('is-active', category.dataset.sbCategory === categoryId));
    itemPanels.forEach((panel) => {
      const active = panel.dataset.sbCategoryPanel === categoryId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  }

  function activateSection(sectionId) {
    sections.forEach((section) => section.classList.toggle('is-active', section.dataset.sbSection === sectionId));
    sectionPanels.forEach((panel) => {
      const active = panel.dataset.sbSectionPanel === sectionId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    const category = firstCategory(sectionId);
    if (category) activateCategory(category.dataset.sbCategory);
  }

  function setMobileLevel(level) {
    mobileLevel = level;
    columns.forEach((column) => column.classList.toggle('is-mobile-active', column.dataset.sbLevel === level));
    back.hidden = level === 'sections';
  }

  function placePopover() {
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const right = triggerRect.right + 4;
    const left = triggerRect.left - popoverRect.width - 4;
    popover.style.left = `${right + popoverRect.width <= window.innerWidth - 8 ? right : Math.max(8, left)}px`;
    popover.style.top = `${Math.min(Math.max(8, triggerRect.top), Math.max(8, window.innerHeight - popoverRect.height - 8))}px`;
  }

  function closeMenu() {
    trigger.setAttribute('aria-expanded', 'false');
    popover.hidden = true;
    backdrop.hidden = true;
    setMobileLevel('sections');
    document.body.classList.remove('sb-bookmarks-open');
  }

  function openMenu() {
    trigger.setAttribute('aria-expanded', 'true');
    popover.hidden = false;
    backdrop.hidden = hoverDevice.matches;
    document.body.classList.toggle('sb-bookmarks-open', !hoverDevice.matches);
    if (sections[0]) activateSection(sections[0].dataset.sbSection);
    setMobileLevel('sections');
    if (portalActive && hoverDevice.matches) window.requestAnimationFrame(placePopover);
  }

  function activateFromHover(element, callback) {
    element.addEventListener('mouseenter', function () {
      if (hoverDevice.matches && trigger.getAttribute('aria-expanded') === 'true') callback();
    });
  }

  trigger.addEventListener('click', function (event) {
    if (trigger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
    event.stopPropagation();
  });

  sections.forEach((section) => {
    activateFromHover(section, () => activateSection(section.dataset.sbSection));
    section.addEventListener('click', function (event) {
      activateSection(section.dataset.sbSection);
      setMobileLevel('categories');
      event.preventDefault();
      event.stopPropagation();
    });
  });

  categories.forEach((category) => {
    activateFromHover(category, () => activateCategory(category.dataset.sbCategory));
    category.addEventListener('click', function (event) {
      activateCategory(category.dataset.sbCategory);
      setMobileLevel('items');
      event.preventDefault();
      event.stopPropagation();
    });
  });

  back.addEventListener('click', function (event) {
    setMobileLevel(mobileLevel === 'items' ? 'categories' : 'sections');
    event.preventDefault();
    event.stopPropagation();
  });

  closeButton.addEventListener('click', function (event) {
    closeMenu();
    event.preventDefault();
    event.stopPropagation();
  });

  backdrop.addEventListener('click', closeMenu);

  popover.querySelectorAll('.sb-bookmarks-item, .sb-bookmarks-extra a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target) && !popover.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      trigger.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (portalActive && hoverDevice.matches && trigger.getAttribute('aria-expanded') === 'true') placePopover();
  });

  setMobileLevel('sections');
})();
