'use strict';

(function () {
  const nav = document.querySelector('.jw-primary-nav');
  if (!nav) return;

  nav.addEventListener('click', (event) => {
    const summary = event.target.closest('.jw-section summary');
    if (!summary || event.target.closest('a')) return;

    const details = summary.parentElement;
    if (!details || !details.matches('details')) return;

    event.preventDefault();
    if (!details.open) {
      details.open = true;
      details.classList.add('is-collapsing');
      requestAnimationFrame(() => details.classList.remove('is-collapsing'));
      return;
    }

    const branch = details.querySelector(':scope > .jw-nav-branch');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !branch) {
      details.open = false;
      return;
    }

    details.classList.add('is-collapsing');
    branch.addEventListener('transitionend', function finishClose(transitionEvent) {
      if (transitionEvent.propertyName !== 'grid-template-rows') return;
      branch.removeEventListener('transitionend', finishClose);
      details.open = false;
      details.classList.remove('is-collapsing');
    });
  });
})();
