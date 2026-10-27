import { books } from "./books.js";
import { toggleFavorite } from "./favorites.js";
import { renderBooks } from "./ui.js";

const grid = document.getElementById("book-grid");

if (grid) {
  renderBooks(grid, books);

  // One click listener for the whole grid (event delegation)
  grid.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-fav-id]");
    if (!btn) return; // the click was not on a heart button

    const book = books.find((b) => b.id === btn.dataset.favId);
    toggleFavorite(book);
    renderBooks(grid, books); // redraw so the hearts update
  });
}