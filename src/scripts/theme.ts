export {};

const THEME_KEY = "theme";
const PALETTE_KEY = "palette";

const LIGHT = "light";
const DARK = "dark";

type Theme = typeof LIGHT | typeof DARK;
type Palette = "kami" | "paper" | "forest" | "amber";

declare global {
  interface Window {
    __theme?: {
      value: Theme;
      palette?: Palette;
    };
  }
}

let themeValue: Theme =
  window.__theme?.value ??
  getPreferredTheme();

let paletteValue: Palette =
  (window.__theme?.palette as Palette) ??
  getStoredPalette();

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
}

function getStoredPalette(): Palette {
  const stored = localStorage.getItem(PALETTE_KEY) as Palette | null;
  if (stored && ["kami", "paper", "forest", "amber"].includes(stored)) {
    return stored;
  }
  return "kami";
}

function updateThemeToggleUI(theme: Theme) {
  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!button) return;

  const nextModeText = theme === LIGHT ? "Switch to dark theme" : "Switch to light theme";
  button.setAttribute("aria-label", nextModeText);
  button.setAttribute("title", nextModeText);

  const tooltip = document.querySelector<HTMLElement>(".theme-tooltip");
  if (tooltip) {
    tooltip.textContent = nextModeText;
  }
}

function updatePaletteUI(palette: Palette) {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-palette-option]");
  buttons.forEach((btn) => {
    const isSelected = btn.dataset.paletteOption === palette;
    btn.setAttribute("aria-selected", String(isSelected));
    btn.classList.toggle("active-palette", isSelected);
  });
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-pf-theme", theme);
  document.documentElement.style.colorScheme = theme;

  window.__theme = {
    ...window.__theme,
    value: theme,
    palette: paletteValue,
  };

  updateThemeColor();
  updateThemeToggleUI(theme);
}

function applyPalette(palette: Palette) {
  paletteValue = palette;
  document.documentElement.setAttribute("data-palette", palette);
  localStorage.setItem(PALETTE_KEY, palette);

  window.__theme = {
    ...window.__theme,
    value: themeValue,
    palette: palette,
  };

  updateThemeColor();
  updatePaletteUI(palette);
}

function updateThemeColor() {
  const background = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();

  const meta = document.querySelector("meta[name='theme-color']");
  meta?.setAttribute("content", background);
}

function persistTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  themeValue = themeValue === LIGHT ? DARK : LIGHT;
  applyTheme(themeValue);
  persistTheme(themeValue);
}

function setupThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!button) return;
  button.onclick = toggleTheme;
  updateThemeToggleUI(themeValue);
}

function setupPalettePicker() {
  const toggleBtn = document.querySelector<HTMLButtonElement>("#palette-toggle");
  const dropdown = document.querySelector<HTMLElement>("#palette-dropdown");
  const options = document.querySelectorAll<HTMLButtonElement>("[data-palette-option]");

  if (!toggleBtn || !dropdown) return;

  const closeDropdown = () => {
    dropdown.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  const openDropdown = () => {
    dropdown.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
  };

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("open");
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  options.forEach((opt) => {
    opt.onclick = (e) => {
      e.stopPropagation();
      const targetPalette = opt.dataset.paletteOption as Palette;
      if (targetPalette) {
        applyPalette(targetPalette);
      }
      closeDropdown();
    };
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target as Node) && e.target !== toggleBtn) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
    }
  });

  updatePaletteUI(paletteValue);
}

function initTheme() {
  applyTheme(themeValue);
  applyPalette(paletteValue);
  setupThemeToggle();
  setupPalettePicker();
}

initTheme();

document.addEventListener("astro:after-swap", initTheme);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    if (localStorage.getItem(THEME_KEY)) return;
    themeValue = matches ? DARK : LIGHT;
    applyTheme(themeValue);
  });