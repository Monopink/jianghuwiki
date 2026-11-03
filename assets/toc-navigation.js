(() => {
  const panel = document.querySelector(".jw-toc");
  const links = [...(panel?.querySelectorAll('#TableOfContents a[href*="#"]') || [])];
  const content = document.querySelector("[data-reading-content]");
  if (!panel || !links.length || !content) return;

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

  let bottom = 0;
  let frame = 0;
  let current = null;
  let pointerInside = false;
  panel.addEventListener("pointerenter", () => { pointerInside = true; });
  panel.addEventListener("pointerleave", () => { pointerInside = false; alignCurrent(); });
  panel.addEventListener("focusin", () => { pointerInside = true; });
  panel.addEventListener("focusout", (event) => {
    if (!panel.contains(event.relatedTarget)) { pointerInside = false; alignCurrent(); }
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
    const area = panel.querySelector(".jw-toc-content").getBoundingClientRect();
    if (box.top < area.top) panel.querySelector(".jw-toc-content").scrollTop -= area.top - box.top;
    else if (box.bottom > area.bottom) panel.querySelector(".jw-toc-content").scrollTop += box.bottom - area.bottom;
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
  panel.querySelectorAll('#TableOfContents a[href*="#"]').forEach((link) => link.addEventListener("click", () => setTimeout(schedule, 0)));
})();
