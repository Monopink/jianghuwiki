const input = document.querySelector("#home-search-input");
const introGroups = document.querySelectorAll(".home-search-links, .quick-dial-group");
let introDuration = 0;

introGroups.forEach((group) => {
  const items = group.matches(".home-search-links")
    ? group.querySelectorAll(".home-search-link")
    : group.querySelectorAll(".quick-dial-row");
  const delayStep = 70;
  const duration = 900;

  items.forEach((item, index) => {
    const delay = index * delayStep;
    item.style.setProperty("--intro-delay", `${delay}ms`);
    introDuration = Math.max(introDuration, delay + duration);
  });
});

if (introGroups.length) {
  window.setTimeout(() => {
    document.querySelectorAll(".home-effects-intro").forEach((component) => {
      component.classList.remove("home-effects-intro");
    });
  }, introDuration + 50);
}

if (input) {
  document.querySelectorAll("[data-search-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const query = input.value.trim();
      if (!query) {
        input.focus();
        return;
      }

      const target = button.dataset.searchUrl.replace("{query}", encodeURIComponent(query));
      window.open(target, "_blank", "noopener,noreferrer");
    });
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.closest(".home-search")?.querySelector("[data-search-url]")?.click();
    }
  });
}
