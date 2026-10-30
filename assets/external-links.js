document.querySelectorAll('a[href]').forEach((link) => {
  const url = new URL(link.href, window.location.href);

  if (!/^https?:$/.test(url.protocol)) {
    return;
  }

  if (url.origin === window.location.origin) {
    link.removeAttribute("target");
    return;
  }

  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
