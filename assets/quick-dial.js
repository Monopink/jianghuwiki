(() => {
  const links = [...document.querySelectorAll('.quick-dial-links a')];
  if (!links.length) return;
  const desktop = matchMedia('(min-width: 56.001rem)');
  const tip = document.createElement('div');
  tip.className = 'jw-quick-dial-tooltip';
  // The link already exposes its full accessible name.
  tip.setAttribute('aria-hidden', 'true');
  tip.hidden = true;
  document.body.append(tip);
  let active;
  const hide = () => { tip.hidden = true; active = null; };
  const show = link => {
    const name = link.querySelector('.quick-dial-name');
    if (!desktop.matches || !name.classList.contains('is-overflowing')) return hide();
    active = link;
    tip.textContent = name.textContent;
    tip.hidden = false;
    const box = link.getBoundingClientRect();
    const size = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(12, Math.min(box.left + (box.width - size.width) / 2, innerWidth - size.width - 12))}px`;
    tip.style.top = `${Math.max(12, box.bottom + size.height + 20 <= innerHeight ? box.bottom + 8 : box.top - size.height - 8)}px`;
  };
  const measure = name => name.classList.toggle('is-overflowing', desktop.matches && name.scrollWidth > name.clientWidth + 1);
  const observer = new ResizeObserver(entries => {
    entries.forEach(({ target }) => measure(target));
    hide();
  });
  links.forEach(link => {
    observer.observe(link.querySelector('.quick-dial-name'));
    link.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show(link); });
    link.addEventListener('pointerleave', () => { if (document.activeElement !== link) hide(); });
    link.addEventListener('focus', () => show(link));
    link.addEventListener('blur', hide);
    link.addEventListener('click', hide);
  });
  document.fonts.ready.then(() => links.forEach(link => measure(link.querySelector('.quick-dial-name'))));
  desktop.addEventListener('change', () => { hide(); links.forEach(link => measure(link.querySelector('.quick-dial-name'))); });
  addEventListener('scroll', hide, { passive: true, capture: true });
  addEventListener('resize', hide);
  document.addEventListener('keydown', event => { if (active && event.key === 'Escape') hide(); });
})();
