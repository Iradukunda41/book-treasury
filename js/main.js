import { initSlider } from "./slider.js";

// 1. Show/hide the mobile menu when the hamburger button is clicked
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// 2. Add a shadow to the navbar once the page is scrolled
const header = document.getElementById("site-header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow-lg", window.scrollY > 10);
  });
}

// 3. Start the hero photo slider (does nothing on pages without a slider)
initSlider();