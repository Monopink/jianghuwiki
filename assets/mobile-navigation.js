const menuButton = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector(".jw-primary-nav");
const menuBackdrop = document.querySelector(".jw-menu-backdrop");
const tocButton = document.querySelector("#toc-toggle");
const tocPanel = document.querySelector(".jw-toc");
const tocBackdrop = document.querySelector(".jw-toc-backdrop");
const closeButtons = document.querySelectorAll("[data-close-panel]");
const mobileQuery = window.matchMedia("(max-width: 56rem)");
let returnFocus = null;
let lockedScrollY = 0;
let inerted = new Map();

const panelFor = (kind) => kind === "menu" ? menuPanel : tocPanel;
const backdropFor = (kind) => kind === "menu" ? menuBackdrop : tocBackdrop;
const activeKind = () => document.body.classList.contains("jw-menu-open") ? "menu" : document.body.classList.contains("jw-toc-open") ? "toc" : null;

const setBackgroundInert = (enabled) => {
  if (enabled) {
    const active = activeKind();
    const candidates = [document.querySelector(".jw-main"), active === "menu" ? tocPanel : menuPanel, ...[...document.body.children].filter((node) => !node.matches(".jw-shell, .jw-menu-backdrop, .jw-toc-backdrop, .jw-search-dialog, [data-jw-popover], [data-jw-backdrop]"))].filter(Boolean);
    inerted = new Map(candidates.map((node) => [node, node.inert]));
    inerted.forEach((_, node) => { node.inert = true; });
  } else {
    inerted.forEach((wasInert, node) => { node.inert = wasInert; });
    inerted.clear();
  }
};

const unlockScroll = () => {
  document.body.classList.remove("jw-panel-scroll-locked");
  document.body.style.removeProperty("top");
  window.scrollTo({ top: lockedScrollY, behavior: "instant" });
};

const closePanels = ({ restore = false, unlock = true } = {}) => {
  const wasScrollLocked = document.body.classList.contains("jw-panel-scroll-locked");
  document.body.classList.remove("jw-menu-open", "jw-toc-open");
  [menuButton, tocButton].filter(Boolean).forEach((button) => button.setAttribute("aria-expanded", "false"));
  [menuBackdrop, tocBackdrop].filter(Boolean).forEach((backdrop) => { backdrop.hidden = true; });
  setBackgroundInert(false);
  if (unlock && wasScrollLocked) unlockScroll();
  if (restore && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  returnFocus = null;
};

const openPanel = (kind, trigger) => {
  closePanels();
  returnFocus = trigger;
  const panel = panelFor(kind);
  document.body.classList.add(kind === "menu" ? "jw-menu-open" : "jw-toc-open");
  trigger.setAttribute("aria-expanded", "true");
  const backdrop = backdropFor(kind);
  if (backdrop) backdrop.hidden = false;
  if (mobileQuery.matches) {
    lockedScrollY = window.scrollY;
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.classList.add("jw-panel-scroll-locked");
    setBackgroundInert(true);
  }
  if (mobileQuery.matches) panel?.querySelector("[data-close-panel]")?.focus({ preventScroll: true });
};

menuButton?.addEventListener("click", () => activeKind() === "menu" ? closePanels() : openPanel("menu", menuButton));
tocButton?.addEventListener("click", () => activeKind() === "toc" ? closePanels() : openPanel("toc", tocButton));
menuBackdrop?.addEventListener("click", () => closePanels({ restore: true }));
tocBackdrop?.addEventListener("click", () => closePanels({ restore: true }));
closeButtons.forEach((button) => button.addEventListener("click", () => closePanels({ restore: true })));

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  if (document.querySelector(".jw-search-dialog[open]")) return;
  const bookmarks = document.querySelector('[data-jw-popover]:not([hidden])');
  // The bookmark menu owns Escape while it is above the navigation drawer.
  if (bookmarks && event.key === "Escape") return;
  const kind = activeKind();
  if (!kind) return;
  if (event.key === "Escape") {
    closePanels({ restore: true });
    return;
  }
  if (event.key !== "Tab") return;
  const panel = bookmarks || panelFor(kind);
  const focusable = [...(panel?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])].filter((item) => !item.hidden && item.getClientRects().length);
  if (!focusable.length) { event.preventDefault(); panel?.focus({ preventScroll: true }); return; }
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
});

tocPanel?.addEventListener("click", (event) => {
  const link = event.target.closest(".jw-toc-mobile a[href^='#']");
  if (!link) return;
  event.preventDefault();
  let target;
  try { target = document.getElementById(decodeURIComponent(link.hash.slice(1))); } catch { return; }
  if (target) {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    const destination = target.getBoundingClientRect().top + (document.body.classList.contains("jw-panel-scroll-locked") ? lockedScrollY : window.scrollY) - (document.querySelector('.jw-mobile-header')?.getBoundingClientRect().height || 0) - 16;
    closePanels({ unlock: false });
    if (document.body.classList.contains("jw-panel-scroll-locked")) {
      document.body.classList.remove("jw-panel-scroll-locked");
      document.body.style.removeProperty("top");
    }
    history.pushState(null, '', link.hash);
    window.scrollTo({ top: Math.max(0, destination), behavior: "instant" });
    target.focus({ preventScroll: true });
  } else closePanels();
});

mobileQuery.addEventListener?.("change", (event) => {
  if (!event.matches) closePanels();
});
if (!mobileQuery.matches) closePanels();
