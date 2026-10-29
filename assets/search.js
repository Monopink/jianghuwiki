'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Name }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(function () {
  const searchDataURL = '{{ partial "docs/links/resource-precache" $searchData }}';
  const searchEngineURL = '{{ "minisearch.min.js" | relURL }}';
  const input = document.querySelector('#book-search-input');
  const results = document.querySelector('#book-search-results');
  if (!input || !results) return;

  let debounce;
  let index;

  input.addEventListener('focus', init, { once: true });
  input.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(search, 250);
  });

  document.addEventListener('keydown', function (event) {
    if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
      if (event.target.value !== undefined) return;
      event.preventDefault();
      input.focus();
    }
  });

  function init() {
    input.required = true;
    Promise.all([
      import(searchEngineURL),
      fetch(searchDataURL).then(response => response.json())
    ]).then(([, records]) => {
      index = new MiniSearch({
        fields: ['title', 'content', 'section'],
        storeFields: ['title', 'content', 'section', 'type', 'href'],
        searchOptions: {
          boost: { title: 2 },
          prefix: true,
          fuzzy: 0.2,
          combineWith: 'AND'
        }
      });
      return index.addAllAsync(records);
    }).then(() => {
      input.required = false;
      search();
    });
  }

  function search() {
    results.replaceChildren();
    if (!input.value || !index) return;

    index.search(input.value).slice(0, 10).forEach(hit => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const title = document.createElement('span');
      const content = document.createElement('small');
      anchor.href = hit.href;
      title.textContent = hit.title;
      content.textContent = `${label(hit.type)} · ${hit.section}`;
      anchor.appendChild(title);
      li.append(anchor, content);
      results.appendChild(li);
    });
  }

  function label(type) {
    return type === 'page' ? '文档' : type === 'app' ? '应用' : '书签';
  }
})();
