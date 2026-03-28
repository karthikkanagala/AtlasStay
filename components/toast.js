// -- FILE: toast.js ------------------------------------
// PURPOSE: Provide global toast notifications with stacking and auto-dismiss
// -- DATA ----------------------------------------------
const ICONS = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️"
};

let toastContainer;

function removeToast(toast, timeoutId) {
  clearTimeout(timeoutId);
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 250);
}

// -- RENDER --------------------------------------------
export function initToast() {
  toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    return;
  }

  window.showToast = function showToast(message, type = "info", duration = 2600) {
    const safeType = ["success", "error", "info", "warning"].includes(type) ? type : "info";

    const toast = document.createElement("div");
    toast.className = `toast toast-${safeType}`;
    toast.innerHTML = `
      <span class="toast-icon">${ICONS[safeType]}</span>
      <span class="toast-msg"></span>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    const msg = toast.querySelector(".toast-msg");
    if (msg) {
      msg.textContent = message;
    }

    const timeoutId = window.setTimeout(() => removeToast(toast, timeoutId), duration);
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn?.addEventListener("click", () => removeToast(toast, timeoutId));

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
  };
}

// -- EVENTS --------------------------------------------
export function showToast(message, type = "info", duration = 2600) {
  if (typeof window.showToast === "function") {
    window.showToast(message, type, duration);
  }
}
