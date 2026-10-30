const menuButton = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector(".book-menu");
const menuBackdrop = document.querySelector(".mobile-menu-backdrop");
const tocButton = document.querySelector("#toc-toggle");
const tocPanel = document.querySelector(".book-toc");
const tocClose = document.querySelector(".book-toc-close");
const tocBackdrop = document.querySelector(".mobile-toc-backdrop");
const header = document.querySelector(".book-header");
const articleTitle = document.querySelector(".book-article h1");

const setMenuOpen = (open) => {
  if (!menuButton || !menuPanel) return;

  menuPanel.id = "mobile-menu-panel";
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  if (menuBackdrop) menuBackdrop.hidden = !open;
};

const setTocOpen = (open) => {
  if (!tocButton || !tocPanel) return;

  tocPanel.id = "mobile-toc-panel";
  document.body.classList.toggle("toc-open", open);
  tocButton.setAttribute("aria-expanded", String(open));
  if (tocBackdrop) tocBackdrop.hidden = !open;
}

const syncTitleState = () => {
  if (!header) return;

  const threshold = articleTitle
    ? articleTitle.getBoundingClientRect().bottom - header.offsetHeight
    : 96;

  document.body.classList.toggle("page-title-visible", threshold <= 0);
};

menuButton?.addEventListener("click", () => {
  setTocOpen(false);
  setMenuOpen(!document.body.classList.contains("menu-open"));
});
menuBackdrop?.addEventListener("click", () => setMenuOpen(false));
tocButton?.addEventListener("click", () => {
  setMenuOpen(false);
  setTocOpen(!document.body.classList.contains("toc-open"));
});
tocClose?.addEventListener("click", () => setTocOpen(false));
tocBackdrop?.addEventListener("click", () => setTocOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setMenuOpen(false);
  setTocOpen(false);
});

let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (scrollFrame) return;

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    syncTitleState();
  });
}, { passive: true });

setMenuOpen(false);
syncTitleState();
