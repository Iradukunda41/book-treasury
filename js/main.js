import { initSlider } from "./slider.js";
import { getFavorites } from "./favorites.js";

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

// 4. Favorites count badge in the navbar (desktop and mobile menu)
function updateFavoritesCount() {
  const count = getFavorites().length;

  document.querySelectorAll("[data-fav-count]").forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0); // hide the badge when it is 0
  });
}

updateFavoritesCount(); // when the page opens
window.addEventListener("favorites:changed", updateFavoritesCount); // add or remove on this page
window.addEventListener("storage", updateFavoritesCount); // changed in another tab