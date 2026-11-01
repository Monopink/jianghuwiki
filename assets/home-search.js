const input = document.querySelector("#home-search-input");
const searchColumns = document.querySelectorAll(".home-search-links");
const quickDialRows = document.querySelectorAll(".quick-dial-row");
const rainbowColors = ["#ff7048", "#ffb347", "#ffe66d", "#35c9a5", "#45aaf2", "#8f7cff", "#ff6fb5"];
const delayStep = 70;
const duration = 900;
const searchRows = Math.max(...Array.from(searchColumns, (column) => column.children.length), 0);
let introDuration = 0;

searchColumns.forEach((column) => {
  Array.from(column.children).forEach((item, row) => {
    item.style.setProperty("--intro-delay", `${row * delayStep}ms`);
    introDuration = Math.max(introDuration, row * delayStep + duration);
  });
});

quickDialRows.forEach((row, index) => {
  const delay = (searchRows + index) * delayStep;
  row.style.setProperty("--intro-delay", `${delay}ms`);
  row.style.setProperty("--quick-dial-color", rainbowColors[index % rainbowColors.length]);
  introDuration = Math.max(introDuration, delay + duration);
});

if (searchColumns.length || quickDialRows.length) {
  window.setTimeout(() => {
    document.querySelectorAll(".home-effects-intro").forEach((component) => {
      component.classList.remove("home-effects-intro");
    });
  }, introDuration + 50);
}

if (input) {
  const homeSearch = input.closest(".home-search");
  const results = homeSearch?.querySelector("#home-search-results");
  const searchDataURL = homeSearch?.dataset.searchDataUrl;
  let records;
  let active = false;
  let visibleResults = [];
  let selectedIndex = 0;

  const loadRecords = async () => {
    if (records || !searchDataURL) return;
    const response = await fetch(searchDataURL);
    if (!response.ok) throw new Error(`Home search index request failed: ${response.status}`);
    records = await response.json();
  };

  const normalize = (value) => String(value || "").toLocaleLowerCase().trim();

  const search = (query) => {
    const normalizedQuery = normalize(query);
    return records
      .map((record, order) => {
        const title = normalize(record.title);
        const text = normalize(record.searchText);
        let score = 0;
        if (title === normalizedQuery) score = 400;
        else if (title.startsWith(normalizedQuery)) score = 300;
        else if (title.includes(normalizedQuery)) score = 200;
        else if (text.includes(normalizedQuery)) score = 100;
        return { record, score, order };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .slice(0, 12)
      .map((result) => result.record);
  };

  const renderResults = () => {
    if (!results || !active || !records || !input.value.trim()) {
      if (results) {
        results.replaceChildren();
        results.hidden = true;
      }
      visibleResults = [];
      return;
    }

    results.replaceChildren();
    visibleResults = search(input.value);
    selectedIndex = 0;
    if (!visibleResults.length) {
      const empty = document.createElement("div");
      empty.className = "home-search-empty";
      empty.textContent = "没有找到匹配结果";
      results.appendChild(empty);
    } else {
      visibleResults.forEach((hit, index) => {
        const anchor = document.createElement("a");
        anchor.href = hit.href;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.className = "home-search-result";
        anchor.setAttribute("role", "option");
        anchor.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
        if (index === selectedIndex) anchor.classList.add("is-selected");
        const icon = document.createElement("span");
        icon.className = "home-search-result-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "↗";
        const title = document.createElement("strong");
        title.textContent = hit.title;
        const meta = document.createElement("small");
        meta.textContent = `${hit.type === "app" ? "应用" : "书签"} · ${hit.section}`;
        title.prepend(icon);
        anchor.append(title, meta);
        results.appendChild(anchor);
      });
    }
    results.hidden = false;
  };

  const updateSelection = () => {
    results?.querySelectorAll(".home-search-result").forEach((result, index) => {
      const selected = index === selectedIndex;
      result.classList.toggle("is-selected", selected);
      result.setAttribute("aria-selected", selected ? "true" : "false");
    });
  };

  input.addEventListener("input", () => {
    if (active) renderResults();
  });

  input.addEventListener("focus", () => {
    if (active) renderResults();
  });

  document.addEventListener("click", (event) => {
    if (!homeSearch?.contains(event.target)) {
      active = false;
      if (results) results.hidden = true;
    }
  });

  const buildSearchUrl = (template, query) => {
    const encodedQuery = encodeURIComponent(query);
    return template
      .replace(/\{query\}/gi, encodedQuery)
      .replace(/%7Bquery%7D/gi, encodedQuery);
  };

  document.querySelectorAll("[data-search-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const query = input.value.trim();
      if (!query) {
        window.open(button.dataset.homeUrl || button.dataset.searchUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const target = buildSearchUrl(button.dataset.searchUrl, query);
      window.open(target, "_blank", "noopener,noreferrer");
    });
  });

  input.addEventListener("keydown", (event) => {
    if (active && visibleResults.length && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      selectedIndex = (selectedIndex + direction + visibleResults.length) % visibleResults.length;
      updateSelection();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (active && visibleResults.length && records) {
        const target = visibleResults[selectedIndex];
        window.open(target.href, "_blank", "noopener,noreferrer");
        return;
      }
      active = true;
      loadRecords().then(renderResults).catch((error) => console.error("Home search initialization failed", error));
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      active = false;
      if (results) results.hidden = true;
    }
  });
}
