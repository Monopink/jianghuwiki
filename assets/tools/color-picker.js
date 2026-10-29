(() => {
  const page = document.querySelector(".color-picker-page");
  if (!page) return;

  const field = page.querySelector(".color-picker-field");
  const strip = page.querySelector(".color-picker-strip");
  const fieldContext = field.getContext("2d");
  const stripContext = strip.getContext("2d");
  const fieldMarker = page.querySelector(".color-picker-canvas-marker");
  const stripMarker = page.querySelector(".color-picker-strip-marker");
  const currentSwatch = page.querySelector(".color-picker-swatch-current");
  const newSwatch = page.querySelector(".color-picker-swatch-new");
  const palette = page.querySelector("[data-color-palette]");
  const addToPalette = page.querySelector(".color-picker-palette-add");
  const inputs = new Map(Array.from(page.querySelectorAll("[data-color-input]")).map((input) => [input.dataset.colorInput, input]));
  const limits = { h: [0, 360], s: [0, 100], b: [0, 100], r: [0, 255], g: [0, 255], "b-rgb": [0, 255] };
  const specs = {
    h: { min: 0, max: 360, axes: ["s", "b"] },
    s: { min: 0, max: 100, axes: ["h", "b"] },
    b: { min: 0, max: 100, axes: ["h", "s"] },
    r: { min: 0, max: 255, axes: ["g", "b-rgb"] },
    g: { min: 0, max: 255, axes: ["r", "b-rgb"] },
    "b-rgb": { min: 0, max: 255, axes: ["r", "g"] },
  };

  let rgb = [239, 233, 231];
  let previousRgb = [...rgb];
  let activeChannel = "h";
  const paletteKey = "strange-book-color-picker-palette";
  let paletteColors = readPalette();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const maxFor = (channel) => limits[channel][1];
  const isHsb = (channel) => ["h", "s", "b"].includes(channel);

  function readPalette() {
    try {
      const stored = JSON.parse(localStorage.getItem(paletteKey) || "[]");
      return Array.isArray(stored) ? stored.filter((value) => hexToRgb(value)) : [];
    } catch {
      return [];
    }
  }

  function savePalette() {
    localStorage.setItem(paletteKey, JSON.stringify(paletteColors));
  }

  function renderPalette() {
    palette.replaceChildren();
    paletteColors.forEach((color) => {
      const item = document.createElement("div");
      item.className = "color-picker-palette-item";
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "color-picker-palette-swatch";
      swatch.style.backgroundColor = color;
      swatch.title = `加载颜色 ${color}`;
      swatch.setAttribute("aria-label", `加载颜色 ${color}`);
      swatch.addEventListener("click", () => {
        rgb = hexToRgb(color);
        render();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "color-picker-palette-remove";
      remove.textContent = "×";
      remove.title = `删除颜色 ${color}`;
      remove.setAttribute("aria-label", `删除颜色 ${color}`);
      remove.addEventListener("click", () => {
        paletteColors = paletteColors.filter((itemColor) => itemColor !== color);
        savePalette();
        renderPalette();
      });
      item.append(swatch, remove);
      palette.append(item);
    });
  }

  function rgbToHex(values) {
    return `#${values.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  }

  function hexToRgb(value) {
    const normalized = value.trim().replace(/^#/, "");
    return /^[\da-f]{6}$/i.test(normalized) ? [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16)) : null;
  }

  function rgbToHsb(values) {
    const [r, g, b] = values.map((value) => value / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6);
      else if (max === g) hue = 60 * ((b - r) / delta + 2);
      else hue = 60 * ((r - g) / delta + 4);
    }
    return [(hue + 360) % 360, max ? delta / max * 100 : 0, max * 100];
  }

  function hsbToRgb([hue, saturation, brightness]) {
    const s = saturation / 100;
    const v = brightness / 100;
    const chroma = v * s;
    const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    const match = v - chroma;
    let values;
    if (hue < 60) values = [chroma, x, 0];
    else if (hue < 120) values = [x, chroma, 0];
    else if (hue < 180) values = [0, chroma, x];
    else if (hue < 240) values = [0, x, chroma];
    else if (hue < 300) values = [x, 0, chroma];
    else values = [chroma, 0, x];
    return values.map((value) => Math.round((value + match) * 255));
  }

  function values() {
    const hsb = rgbToHsb(rgb);
    return { h: hsb[0], s: hsb[1], b: hsb[2], r: rgb[0], g: rgb[1], "b-rgb": rgb[2] };
  }

  function colorFrom(valuesToUse) {
    return isHsb(activeChannel) ? hsbToRgb([valuesToUse.h, valuesToUse.s, valuesToUse.b]) : [valuesToUse.r, valuesToUse.g, valuesToUse["b-rgb"]];
  }

  function setChannel(channel, value) {
    const next = values();
    const [min, max] = limits[channel];
    next[channel] = clamp(value, min, max);
    rgb = colorFrom(next);
  }

  function drawField() {
    const spec = specs[activeChannel];
    const image = fieldContext.createImageData(field.width, field.height);
    const base = values();
    for (let y = 0; y < field.height; y += 1) {
      for (let x = 0; x < field.width; x += 1) {
        const sample = { ...base };
        sample[spec.axes[0]] = x / (field.width - 1) * maxFor(spec.axes[0]);
        sample[spec.axes[1]] = (1 - y / (field.height - 1)) * maxFor(spec.axes[1]);
        const color = colorFrom(sample);
        const offset = (y * field.width + x) * 4;
        image.data[offset] = color[0];
        image.data[offset + 1] = color[1];
        image.data[offset + 2] = color[2];
        image.data[offset + 3] = 255;
      }
    }
    fieldContext.putImageData(image, 0, 0);
  }

  function drawStrip() {
    const spec = specs[activeChannel];
    const base = values();
    for (let y = 0; y < strip.height; y += 1) {
      const sample = { ...base };
      sample[activeChannel] = spec.min + (1 - y / (strip.height - 1)) * (spec.max - spec.min);
      const color = colorFrom(sample);
      stripContext.fillStyle = `rgb(${color.join(",")})`;
      stripContext.fillRect(0, y, strip.width, 1);
    }
  }

  function updateMarkers() {
    const spec = specs[activeChannel];
    const current = values();
    const fieldRect = field.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    fieldMarker.style.left = `${current[spec.axes[0]] / maxFor(spec.axes[0]) * fieldRect.width}px`;
    fieldMarker.style.top = `${(1 - current[spec.axes[1]] / maxFor(spec.axes[1])) * fieldRect.height}px`;
    stripMarker.style.top = `${(1 - (current[activeChannel] - spec.min) / (spec.max - spec.min)) * stripRect.height}px`;
  }

  function sync() {
    const current = { ...values(), hex: rgbToHex(rgb) };
    inputs.forEach((input, key) => {
      if (document.activeElement !== input) input.value = key === "hex" ? current[key] : Math.round(current[key] * 100) / 100;
    });
    currentSwatch.style.backgroundColor = rgbToHex(previousRgb);
    newSwatch.style.backgroundColor = rgbToHex(rgb);
  }

  function render() {
    drawField();
    drawStrip();
    sync();
    updateMarkers();
  }

  page.querySelectorAll("input[type=radio][name=color-channel]").forEach((radio) => radio.addEventListener("change", () => {
    activeChannel = radio.value;
    render();
  }));

  inputs.forEach((input, key) => input.addEventListener("change", () => {
    if (key === "hex") {
      const next = hexToRgb(input.value);
      if (next) rgb = next;
    } else setChannel(key, Number(input.value));
    render();
  }));

  let dragging;
  function pickField(event) {
    const rect = field.getBoundingClientRect();
    const spec = specs[activeChannel];
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    const next = values();
    next[spec.axes[0]] = x * maxFor(spec.axes[0]);
    next[spec.axes[1]] = (1 - y) * maxFor(spec.axes[1]);
    rgb = colorFrom(next);
    render();
  }

  function pickStrip(event) {
    const rect = strip.getBoundingClientRect();
    const spec = specs[activeChannel];
    setChannel(activeChannel, spec.min + (1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)) * (spec.max - spec.min));
    render();
  }

  page.addEventListener("pointerdown", (event) => {
    if (event.target === field) dragging = pickField;
    else if (event.target === strip) dragging = pickStrip;
    if (dragging) dragging(event);
  });
  page.addEventListener("pointermove", (event) => dragging?.(event));
  page.addEventListener("pointerup", () => { dragging = null; });
  window.addEventListener("resize", updateMarkers);
  addToPalette.addEventListener("click", () => {
    const color = rgbToHex(rgb);
    paletteColors = [color, ...paletteColors.filter((itemColor) => itemColor !== color)].slice(0, 24);
    savePalette();
    renderPalette();
  });
  renderPalette();
  render();
})();
