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
  document.querySelectorAll("[data-search-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const query = input.value.trim();
      if (!query) {
        window.open(button.dataset.homeUrl || button.dataset.searchUrl, "_blank", "noopener,noreferrer");
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
