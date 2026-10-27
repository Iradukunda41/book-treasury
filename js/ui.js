import { isFavorite } from "./favorites.js";

// Make text safe before putting it inside HTML.
// Titles or authors from the API may contain quotes or < > characters
// that would break the card (or run unwanted HTML).
function escapeHTML(text = "") {
  return String(text).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

// Small SVG icons (Heroicons) for the Add / Remove button
const ADD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`;

const REMOVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;

// Build the HTML of one book card
export function createBookCard(book, favorite) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const id = escapeHTML(book.id);

  // Show the year only when the book really has one
  const yearLine = book.year
    ? `<p class="mt-2 text-xs font-medium text-accent">Year of published: ${escapeHTML(book.year)}</p>`
    : "";

  return `
    <article class="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-amber-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative flex h-56 items-center justify-center bg-gradient-to-br from-amber-100 to-green-100 text-accent/60">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-16 w-16">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
        </svg>
        <button
          data-fav-id="${id}"
          aria-pressed="${favorite}"
          aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
          class="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow transition ${favorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="${favorite ? "currentColor" : "none"}" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>
      <div class="p-4">
        <h3 class="truncate font-semibold text-brand" title="${title}">${title}</h3>
        <p class="text-sm text-gray-500">${author}</p>
        ${yearLine}

        <!-- Add / Remove button: same data-fav-id, so home.js and favorites-page.js already handle it -->
        <button
          data-fav-id="${id}"
          class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${favorite ? "border-2 border-red-400 text-red-500 hover:bg-red-50" : "bg-accent text-white hover:bg-amber-700"}">
          ${favorite ? REMOVE_ICON + "Remove" : ADD_ICON + "Add to Favorites"}
        </button>
      </div>
    </article>
  `;
}

// Draw a list of books inside a container (or an empty message)
export function renderBooks(container, books, emptyMessage = "No books to show.") {
  if (books.length === 0) {
    container.innerHTML = `<p class="col-span-full py-12 text-center text-gray-500">${escapeHTML(emptyMessage)}</p>`;
    return;
  }
  container.innerHTML = books
    .map((book) => createBookCard(book, isFavorite(book.id)))
    .join("");
}