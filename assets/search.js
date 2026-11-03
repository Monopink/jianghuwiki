'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Name }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(() => {
  const dialog = document.querySelector('#jw-site-search');
  const trigger = document.querySelector('.jw-search-trigger');
  if (!dialog || !trigger) return;
  // Keep the dialog outside mobile navigation's inert background.
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.jw-search-results');
  const status = dialog.querySelector('.jw-search-status');
  const searchDataURL = '{{ partial "docs/links/resource-precache" $searchData }}';
  const searchEngineURL = '{{ "minisearch.min.js" | relURL }}';
  let index, loading, debounce, returnFocus;
  const desktopMotion = window.matchMedia('(min-width: 56.001rem) and (prefers-reduced-motion: no-preference)');
  const openingAnimations = [];
  function clearOpeningAnimations() {
    openingAnimations.splice(0).forEach(animation => animation.cancel());
  }
  async function init() {
    if (index) return;
    if (!loading) loading = Promise.all([
      import(searchEngineURL),
      fetch(searchDataURL).then(response => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
    ]).then(async ([engine, records]) => {
      const MiniSearch = engine.default || window.MiniSearch;
      const next = new MiniSearch({
        fields: ['title', 'content', 'section'],
        storeFields: ['title', 'content', 'section', 'type', 'href'],
        searchOptions: { boost: { title: 2 }, prefix: true, fuzzy: 0.2, combineWith: 'AND' }
      });
      await next.addAllAsync(records);
      index = next;
    }).catch(error => { loading = null; throw error; });
    return loading;
  }
  async function search() {
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) { status.textContent = ''; return; }
    status.textContent = '正在搜索…';
    try {
      await init();
      if (input.value.trim() !== query) return;
      const hits = index.search(query);
      status.textContent = hits.length ? `找到 ${hits.length} 项，显示前 ${Math.min(30, hits.length)} 项` : '没有找到结果，请尝试其他关键词';
      for (const hit of hits.slice(0, 30)) {
        const row = document.createElement('li');
        const link = document.createElement('a');
        const title = document.createElement('strong');
        const meta = document.createElement('small');
        link.href = hit.href;
        title.textContent = hit.title;
        meta.textContent = `${hit.type === 'page' ? '文档' : hit.type === 'app' ? '应用' : '书签'} · ${hit.section || ''}`;
        link.append(title, meta); row.append(link); results.append(row);
      }
    } catch (error) {
      if (input.value.trim() !== query) return;
      status.textContent = '搜索加载失败，请重新输入以重试';
      console.error('Site search failed', error);
    }
  }
  function open() {
    if (dialog.open) return;
    clearOpeningAnimations();
    returnFocus = document.activeElement;
    const source = trigger.getBoundingClientRect();
    dialog.showModal();
    input.focus({ preventScroll: true });
    if (desktopMotion.matches && source.width > 0 && source.height > 0) {
      const target = dialog.getBoundingClientRect();
      const timing = { duration: 280, easing: 'cubic-bezier(.2, .8, .2, 1)' };
      openingAnimations.push(dialog.animate([
        { transformOrigin: 'top left', transform: `translate(${source.left - target.left}px, ${source.top - target.top}px) scale(${source.width / target.width}, ${source.height / target.height})` },
        { transformOrigin: 'top left', transform: 'none' }
      ], timing));
      for (const child of dialog.children) {
        openingAnimations.push(child.animate([{ opacity: 0 }, { opacity: 0, offset: .35 }, { opacity: 1 }], timing));
      }
    }
    search();
  }
  trigger.addEventListener('click', open);
  dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { clearOpeningAnimations(); returnFocus?.focus({ preventScroll: true }); });
  desktopMotion.addEventListener('change', clearOpeningAnimations);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    results.replaceChildren();
    status.textContent = input.value.trim() ? '正在搜索…' : '';
    debounce = setTimeout(search, 180);
  });
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); results.querySelector('a')?.click();
  });
  dialog.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement);
    if (event.key === 'ArrowUp' && current <= 0) input.focus();
    else links[Math.min(links.length - 1, Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1)))].focus();
  });
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !editing)) {
      event.preventDefault(); open();
    }
  });
})();
