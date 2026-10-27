const STORAGE_KEY = "book-treasury-favorites";

// Read the saved list from localStorage ([] if nothing saved or data is broken)
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Save the list to localStorage (localStorage only stores text, so we use JSON)
function saveFavorites(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function isFavorite(id) {
  return getFavorites().some((book) => book.id === id);
}

export function addFavorite(book) {
  const list = getFavorites();
  if (list.some((b) => b.id === book.id)) return list; // already saved
  list.push(book);
  saveFavorites(list);
  return list;
}

export function removeFavorite(id) {
  const list = getFavorites().filter((book) => book.id !== id);
  saveFavorites(list);
  return list;
}

// Add if not saved, remove if saved. Returns true when the book is now a favorite.
export function toggleFavorite(book) {
  if (isFavorite(book.id)) {
    removeFavorite(book.id);
    return false;
  }
  addFavorite(book);
  return true;
}