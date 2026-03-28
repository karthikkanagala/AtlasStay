// -- FILE: navbar.js -----------------------------------
// PURPOSE: Handle navbar interactions for desktop and mobile navigation
// -- DATA ----------------------------------------------
const NAV_OFFSET = 118;

function setActiveNavLink(sectionId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("active", isActive);
  });
}

function scrollToTarget(hash) {
  const section = document.querySelector(hash);
  if (!section) {
    return;
  }
  const y = section.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// -- RENDER --------------------------------------------
export function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      if (href) {
        scrollToTarget(href);
      }
      setActiveNavLink(link.dataset.section || "home");
      hamburger?.classList.remove("open");
      navLinks?.classList.remove("open");
    });
  });

  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      const section = document.querySelector(href);
      if (!section) {
        return;
      }
      event.preventDefault();
      scrollToTarget(href);
    });
  });
}

// -- EVENTS --------------------------------------------
export function highlightNav(sectionId) {
  setActiveNavLink(sectionId);
}
