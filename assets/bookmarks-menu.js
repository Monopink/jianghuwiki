'use strict';

(function () {
  const root = document.querySelector('[data-jw-bookmarks]');
  if (!root) return;

  const trigger = root.querySelector('[data-jw-toggle]');
  const popover = root.querySelector('[data-jw-popover]');
  const backdrop = root.querySelector('[data-jw-backdrop]');
  const sections = [...root.querySelectorAll('[data-jw-section]')];
  const categories = [...root.querySelectorAll('[data-jw-category]')];
  const sectionPanels = [...root.querySelectorAll('[data-jw-section-panel]')];
  const itemPanels = [...root.querySelectorAll('[data-jw-category-panel]')];
  const columns = [...root.querySelectorAll('[data-jw-level]')];
  const back = root.querySelector('[data-jw-back]');
  const closeButton = root.querySelector('[data-jw-close]');
  // iPadOS Safari may report hover/fine-pointer support, especially in
  // landscape mode or with a keyboard/trackpad attached. Touch capability
  // should take precedence so the menu keeps using the touch interaction.
  const touchDevice =
    window.matchMedia('(pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0 ||
    'ontouchstart' in window;
  const compactLayout = window.matchMedia('(max-width: 56rem)');
  const hoverDevice = {
    get matches() {
      return !touchDevice && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    },
  };
  let portalActive = true;
  let mobileLevel = 'sections';

  document.body.appendChild(popover);
  document.body.appendChild(backdrop);

  function firstCategory(sectionId) {
    const sectionIndex = sections.findIndex((section) => section.dataset.jwSection === sectionId);
    const sectionCategories = categories.filter((category) => category.dataset.jwParentSection === sectionId);

    if (sectionIndex < 0 || sectionCategories.length === 0) return undefined;

    return sectionCategories[Math.min(sectionIndex, sectionCategories.length - 1)];
  }

  function activateCategory(categoryId) {
    categories.forEach((category) => category.classList.toggle('is-active', !compactLayout.matches && category.dataset.jwCategory === categoryId));
    itemPanels.forEach((panel) => {
      const active = panel.dataset.jwCategoryPanel === categoryId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  }

  function activateSection(sectionId) {
    sections.forEach((section) => section.classList.toggle('is-active', !compactLayout.matches && section.dataset.jwSection === sectionId));
    sectionPanels.forEach((panel) => {
      const active = panel.dataset.jwSectionPanel === sectionId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    const category = firstCategory(sectionId);
    if (category) activateCategory(category.dataset.jwCategory);
  }

  function setMobileLevel(level) {
    mobileLevel = level;
    columns.forEach((column) => column.classList.toggle('is-mobile-active', column.dataset.jwLevel === level));
    back.hidden = level === 'sections';
    if (compactLayout.matches && trigger.getAttribute('aria-expanded') === 'true' && !popover.hidden) {
      const column = columns.find(column => column.dataset.jwLevel === level);
      [...(column?.querySelectorAll('a') || [])].find(link => link.getClientRects().length)
        ?.focus({ preventScroll: true });
    }
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
    const restoreFocus = popover.contains(document.activeElement);
    trigger.setAttribute('aria-expanded', 'false');
    popover.hidden = true;
    backdrop.hidden = true;
    setMobileLevel('sections');
    document.body.classList.remove('jw-bookmarks-open');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  function openMenu() {
    trigger.setAttribute('aria-expanded', 'true');
    popover.hidden = false;
    backdrop.hidden = !compactLayout.matches;
    document.body.classList.toggle('jw-bookmarks-open', compactLayout.matches);
    if (!compactLayout.matches && sections[0]) activateSection(sections[0].dataset.jwSection);
    if (compactLayout.matches) {
      sections.concat(categories).forEach(item => item.classList.remove('is-active'));
    }
    setMobileLevel('sections');
    if (portalActive && !compactLayout.matches) window.requestAnimationFrame(placePopover);
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
    activateFromHover(section, () => activateSection(section.dataset.jwSection));
    section.addEventListener('click', function (event) {
      activateSection(section.dataset.jwSection);
      setMobileLevel('categories');
      event.preventDefault();
      event.stopPropagation();
    });
  });

  categories.forEach((category) => {
    activateFromHover(category, () => activateCategory(category.dataset.jwCategory));
    category.addEventListener('click', function (event) {
      activateCategory(category.dataset.jwCategory);
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

  popover.querySelectorAll('.jw-bookmarks-item, .jw-bookmarks-extra a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target) && !popover.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (document.querySelector('.jw-search-dialog[open]')) return;
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      closeMenu();
      trigger.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (portalActive && !compactLayout.matches && trigger.getAttribute('aria-expanded') === 'true') {
      placePopover();
    }
  });
  compactLayout.addEventListener('change', () => {
    if (trigger.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  setMobileLevel('sections');
})();
