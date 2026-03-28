// -- FILE: themeToggle.js ------------------------------
// PURPOSE: Manage dark/light theme and keep chart visuals in sync
// -- DATA ----------------------------------------------
const STORAGE_KEY = "atlasstay_theme";

function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || "light";
}

function setIcon(theme) {
  const icon = document.getElementById("theme-icon");
  if (!icon) {
    return;
  }
  icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

// -- RENDER --------------------------------------------
export function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const initialTheme = getTheme();

  html.classList.toggle("dark", initialTheme === "dark");
  setIcon(initialTheme);

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    const nextTheme = isDark ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setIcon(nextTheme);
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: nextTheme } }));
  });
}

// -- EVENTS --------------------------------------------
export function getCurrentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
