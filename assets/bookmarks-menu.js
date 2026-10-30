'use strict';

(function () {
  const menu = document.querySelector('[data-bookmarks-menu]');
  if (!menu) return;

  function panelFor(button) {
    return button.nextElementSibling;
  }

  function setExpanded(button, expanded) {
    const panel = panelFor(button);
    button.setAttribute('aria-expanded', String(expanded));
    if (panel) panel.hidden = !expanded;
  }

  function closeSiblings(button) {
    const parent = button.parentElement.parentElement;
    if (!parent) return;
    parent.querySelectorAll(':scope > .bookmarks-menu-section > button[aria-expanded="true"], :scope > .bookmarks-menu-category > button[aria-expanded="true"]').forEach((sibling) => {
      if (sibling !== button) setExpanded(sibling, false);
    });
  }

  menu.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button || !menu.contains(button)) return;

    const isMain = button.hasAttribute('data-bookmarks-toggle');
    const isSection = button.hasAttribute('data-bookmarks-section-toggle');
    const isCategory = button.hasAttribute('data-bookmarks-category-toggle');
    if (!isMain && !isSection && !isCategory) return;

    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (!expanded && (isSection || isCategory)) closeSiblings(button);
    setExpanded(button, !expanded);
    event.preventDefault();
  });

  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target)) {
      const trigger = menu.querySelector('[data-bookmarks-toggle]');
      if (trigger) setExpanded(trigger, false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    const trigger = menu.querySelector('[data-bookmarks-toggle]');
    if (!trigger || trigger.getAttribute('aria-expanded') !== 'true') return;
    setExpanded(trigger, false);
    trigger.focus();
  });
})();
