import { getFavorites, removeFavorite } from "./favorites.js";
import { renderBooks } from "./ui.js";

const grid = document.getElementById("favorites-grid");
const count = document.getElementById("favorites-count");

function render() {
  const list = getFavorites();
  count.textContent = list.length === 1 ? "1 book saved" : `${list.length} books saved`;
  renderBooks(
    grid,
    list,
    "You have no favorite books yet. Go to the home page and tap the heart on a book."
  );
}

// Clicking a heart on this page removes the book from favorites
grid.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-fav-id]");
  if (!btn) return;

  removeFavorite(btn.dataset.favId);
  render();
});

render();