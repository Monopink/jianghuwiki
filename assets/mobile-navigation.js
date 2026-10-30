const menuControl = document.querySelector("#menu-control");
const tocButton = document.querySelector("#toc-toggle");
const tocPanel = document.querySelector(".book-toc");
const tocClose = document.querySelector(".book-toc-close");
const tocBackdrop = document.querySelector(".mobile-toc-backdrop");
const header = document.querySelector(".book-header");
const articleTitle = document.querySelector(".book-article h1");

const syncMenuState = () => {
  document.body.classList.toggle("menu-open", Boolean(menuControl?.checked));
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

menuControl?.addEventListener("change", syncMenuState);
tocButton?.addEventListener("click", () => {
  if (menuControl) menuControl.checked = false;
  syncMenuState();
  setTocOpen(!document.body.classList.contains("toc-open"));
});
tocClose?.addEventListener("click", () => setTocOpen(false));
tocBackdrop?.addEventListener("click", () => setTocOpen(false));

let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (scrollFrame) return;

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    syncTitleState();
  });
}, { passive: true });

syncMenuState();
syncTitleState();
