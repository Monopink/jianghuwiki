(() => {
  const mobile = matchMedia('(max-width: 56rem)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stagger = (elements) => {
    if (!mobile.matches || reduced.matches) return;
    elements.filter(element => element.getClientRects().length).forEach((element, index) => {
      element.getAnimations().forEach(animation => animation.cancel());
      element.animate([
        { opacity: 0, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 380, delay: Math.min(index, 10) * 28, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    });
  };
  let previous = '';
  new MutationObserver(() => {
    const kind = document.body.classList.contains('jw-menu-open') ? 'menu' : document.body.classList.contains('jw-toc-open') ? 'toc' : '';
    if (kind !== previous) {
      previous = kind;
      if (kind) stagger([...document.querySelectorAll(kind === 'menu' ? '.jw-primary-nav .jw-brand, .jw-primary-nav .jw-search, .jw-primary-nav nav > ul > li, .jw-menu-footer' : '.jw-toc-content li')]);
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const bookmarks = document.querySelector('[data-jw-popover]');
  if (bookmarks) new MutationObserver(() => {
    if (!bookmarks.hidden) stagger([...bookmarks.querySelectorAll('.is-mobile-active a')]);
  }).observe(bookmarks, { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });

  const header = document.querySelector('.jw-mobile-header');
  const heading = document.querySelector('.jw-main h1');
  const brand = header?.querySelector('.jw-header-brand');
  const title = header?.querySelector('.jw-header-title');
  if (!heading || !brand || !title) return;
  title.textContent = heading.textContent;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (document.body.classList.contains('jw-panel-scroll-locked')) return;
    const show = mobile.matches && heading.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom;
    header.classList.toggle('jw-header-shows-title', show);
    brand.setAttribute('aria-hidden', String(show));
    title.setAttribute('aria-hidden', String(!show));
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(heading);
  update();
})();
