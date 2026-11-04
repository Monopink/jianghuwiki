'use strict';

(() => {
  const nav = document.querySelector('.jw-primary-nav');
  if (!nav) return;
  const states = new WeakMap();
  nav.addEventListener('click', event => {
    const summary = event.target.closest('.jw-section summary');
    if (!summary || event.target.closest('a')) return;
    const details = summary.parentElement;
    const branch = details.querySelector(':scope > .jw-nav-branch');
    if (!branch) return;
    event.preventDefault();
    const previous = states.get(details);
    const opening = previous ? !previous.opening : !details.open;
    const height = details.open ? branch.getBoundingClientRect().height : 0;
    previous?.animation.cancel();
    details.open = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      details.open = opening;
      states.delete(details);
      return;
    }
    const animation = branch.animate([
      { height: `${height}px`, opacity: height ? 1 : 0 },
      { height: `${opening ? branch.scrollHeight : 0}px`, opacity: opening ? 1 : 0 }
    ], { duration: 180, easing: 'ease', fill: 'both' });
    const state = { opening, animation };
    states.set(details, state);
    animation.finished.then(() => {
      if (states.get(details) !== state) return;
      details.open = opening;
      animation.cancel();
      states.delete(details);
    }).catch(() => {});
  });
})();
