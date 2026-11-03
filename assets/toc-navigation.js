(() => {
  const panel = document.querySelector(".jw-toc");
  const desktop = panel?.querySelector(".jw-toc-desktop");
  const mobile = panel?.querySelector(".jw-toc-mobile");
  const desktopQuery = window.matchMedia("(min-width: 56.001rem)");
  if (desktop && mobile) {
    const source = desktop.querySelector("#TableOfContents");
    const root = source?.querySelector(":scope > ul");
    if (root) {
      const list = document.createElement("ul");
      root.querySelectorAll(":scope > li").forEach((item) => {
        const link = item.querySelector(":scope > a");
        if (!link) return;
        const row = document.createElement("li");
        row.append(link.cloneNode(true));
        list.append(row);
        const children = item.querySelector(":scope > ul");
        children?.querySelectorAll(":scope > li > a").forEach((childLink) => {
          const child = document.createElement("li");
          child.className = "jw-toc-mobile-child";
          child.append(childLink.cloneNode(true));
          list.append(child);
        });
      });
      mobile.replaceChildren(list);
      mobile.hidden = false;
    }
  }
  const links = [...(desktop?.querySelectorAll('#TableOfContents a[href*="#"]') || [])];
  const content = document.querySelector("[data-reading-content]");
  if (!panel || !desktop || !links.length || !content || !desktopQuery.matches) return;

  const entries = [];
  for (const link of links) {
    let id;
    try {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) continue;
      id = decodeURIComponent(url.hash.slice(1));
    }
    catch { continue; }
    const target = document.getElementById(id);
    if (!target || !target.getClientRects().length || !content.contains(target) || entries.some((item) => item.target === target)) continue;
    entries.push({ link, target });
  }
  if (!entries.length) return;
  let current = null;
  let applyBranches = () => {};

  const rootList = desktop.querySelector("#TableOfContents > ul");
  const branches = [];
  if (rootList) {
    rootList.querySelectorAll("li").forEach((item, index) => {
      const childList = [...item.children].find((child) => child.tagName === "UL");
      const link = [...item.children].find((child) => child.tagName === "A");
      if (!childList || !link) return;
      branches.push({ item, childList, link });
    });
  }
  applyBranches = () => {
    const active = current?.link;
    branches.forEach((branch) => {
      const autoOpen = Boolean(active && branch.item.contains(active));
      branch.childList.hidden = !autoOpen;
    });
  };

  let bottom = 0;
  let frame = 0;
  let pointerInside = false;
  desktop.addEventListener("pointerenter", () => { pointerInside = true; });
  desktop.addEventListener("pointerleave", () => { pointerInside = false; alignCurrent(); });
  desktop.addEventListener("focusin", () => { pointerInside = true; });
  desktop.addEventListener("focusout", (event) => {
    if (!desktop.contains(event.relatedTarget)) { pointerInside = false; alignCurrent(); }
  });

  const offset = () => document.querySelector(".jw-mobile-header")?.getBoundingClientRect().height || 0;
  const measure = () => {
    const scrollY = window.scrollY;
    entries.forEach((entry) => { entry.top = entry.target.getBoundingClientRect().top + scrollY; });
    entries.sort((a, b) => a.top - b.top);
    bottom = content.getBoundingClientRect().bottom + scrollY;
  };
  const alignCurrent = () => {
    if (!current || pointerInside) return;
    const box = current.link.getBoundingClientRect();
    const area = desktop.getBoundingClientRect();
    if (box.top < area.top) desktop.scrollTop -= area.top - box.top;
    else if (box.bottom > area.bottom) desktop.scrollTop += box.bottom - area.bottom;
  };
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    const line = y + offset() + 24;
    let selected = null;
    if (line >= entries[0].top) {
      for (const entry of entries) {
        if (entry.top <= line) selected = entry;
        else break;
      }
    }
    if (y + window.innerHeight >= bottom - 1) selected = entries.at(-1);
    if (selected !== current) {
      for (const entry of entries) {
        if (entry === selected) entry.link.setAttribute("aria-current", "location");
        else entry.link.removeAttribute("aria-current");
      }
      current = selected;
      applyBranches();
      alignCurrent();
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  measure();
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => { measure(); schedule(); }, { passive: true });
  window.addEventListener("load", () => { measure(); schedule(); }, { once: true });
  document.fonts?.ready.then(() => { measure(); schedule(); });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => { measure(); schedule(); });
    observer.observe(content);
  }
  document.querySelectorAll("[data-reading-content] img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", () => { measure(); schedule(); }, { once: true });
  });
  desktop.querySelectorAll('#TableOfContents a[href*="#"]').forEach((link) => link.addEventListener("click", () => setTimeout(schedule, 0)));
})();
