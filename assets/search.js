'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(function () {
  const searchDataURL = '{{ $searchData.RelPermalink }}';
  const input = document.querySelector('#book-search-input');
  const results = document.querySelector('#book-search-results');
  if (!input || !results) return;
  const indexConfig = { includeScore: true, ignoreLocation: true, threshold: 0.35, keys: [
    { name: 'title', weight: 0.55 }, { name: 'content', weight: 0.35 }, { name: 'section', weight: 0.10 }
  ]};
  function init() {
    input.removeEventListener('focus', init); input.required = true;
    fetch(searchDataURL).then(response => response.json()).then(records => { window.bookSearchIndex = new Fuse(records, indexConfig); }).then(() => { input.required = false; search(); });
  }
  function search() {
    results.replaceChildren(); if (!input.value || !window.bookSearchIndex) return;
    window.bookSearchIndex.search(input.value).slice(0, 20).forEach(hit => {
      const li = document.createElement('li'), a = document.createElement('a'), small = document.createElement('small');
      a.href = hit.item.href; a.textContent = hit.item.title; small.textContent = `${hit.item.type === 'page' ? '文档' : hit.item.type === 'app' ? '应用' : '书签'} · ${hit.item.section}`; li.append(a, small); results.appendChild(li);
    });
  }
  input.addEventListener('focus', init); input.addEventListener('input', search);
})();
