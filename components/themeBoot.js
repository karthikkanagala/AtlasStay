// -- FILE: themeBoot.js --------------------------------
// PURPOSE: Apply stored theme before initial render to avoid theme flash
// -- DATA ----------------------------------------------
const STORAGE_KEY = "atlasstay_theme";

// -- RENDER --------------------------------------------
export function applyStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY) || "light";
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// -- EVENTS --------------------------------------------
applyStoredTheme();
