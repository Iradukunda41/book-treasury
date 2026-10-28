import { fetchBooks } from "./fetchBooks.js";
import { toggleFavorite } from "./favorites.js";
import { renderBooks } from "./ui.js";

const grid = document.getElementById("book-grid");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");

const DEFAULT_QUERY = "african literature";

let currentBooks = []; // the books now shown (the click handler searches here)
let lastQuery = DEFAULT_QUERY; // remembered so "Try again" can repeat it

// LOADING STATE: a spinner while we wait for the API
function showLoading() {
  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center gap-4 py-16 text-gray-500">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-accent"></div>
      <p>Loading books...</p>
    </div>
  `;
}

// ERROR STATE: a message and a button to try again
function showError() {
  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center gap-4 py-16 text-center">
      <p class="font-semibold text-brand">Sorry, we could not load the books.</p>
      <p class="text-sm text-gray-500">Check your internet connection and try again.</p>
      <button id="retry-btn" class="rounded-full bg-accent px-6 py-2 font-semibold text-white hover:bg-amber-700">
        Try again
      </button>
    </div>
  `;
}

// Get books from the API and draw them
async function loadBooks(query) {
  lastQuery = query;
  showLoading();

  try {
    currentBooks = await fetchBooks(query);
    renderBooks(
      grid,
      currentBooks,
      `No books found for "${query}". Try another title.`
    );
  } catch (error) {
    console.error(error); // the real reason stays visible for us in DevTools
    currentBooks = [];
    showError();
  }
}

if (grid) {
  // One click listener for the whole grid (event delegation)
  grid.addEventListener("click", (event) => {
    // "Try again" button after an error
    if (event.target.closest("#retry-btn")) {
      loadBooks(lastQuery);
      return;
    }

    // Heart or Add/Remove button on a card
    const btn = event.target.closest("[data-fav-id]");
    if (!btn) return;

    const book = currentBooks.find((b) => b.id === btn.dataset.favId);
    if (!book) return;

    toggleFavorite(book);
    renderBooks(grid, currentBooks); // redraw so the buttons update
  });

  // SEARCH: when the form is sent (Search button or Enter key)
  if (form && input) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // stop the page from reloading
      const query = input.value.trim();
      loadBooks(query || DEFAULT_QUERY);
    });
  }

  // First load when the page opens
  loadBooks(DEFAULT_QUERY);
}