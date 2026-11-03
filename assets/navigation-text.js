(() => {
  const labels = [];
  const update = (target) => target.classList.toggle('is-overflowing', target.scrollWidth > target.clientWidth + 1);
  const observer = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      update(target);
    }
  });
  document.querySelectorAll('.jw-primary-nav .jw-nav-link, .jw-section summary > span, .jw-toc a').forEach((element) => {
    const text = element.matches('summary > span') ? element : document.createElement('span');
    if (text !== element) {
      text.append(...element.childNodes);
      element.append(text);
    }
    text.classList.add('jw-nav-text');
    labels.push(text);
    observer.observe(text);
  });
  const refresh = () => labels.forEach(update);
  document.fonts.ready.then(refresh);
  const states = new MutationObserver(refresh);
  document.querySelectorAll('.jw-primary-nav, .jw-toc').forEach((panel) => {
    states.observe(panel, { subtree: true, attributes: true, attributeFilter: ['open', 'aria-current'] });
  });
})();
