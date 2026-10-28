// Lab 3: get real books from the Open Library API.
const BASE_URL = "https://openlibrary.org/search.json";

// Ask the API for books matching `query` and return a clean list.
// It is "async" because waiting for the internet takes time.
export async function fetchBooks(query = "african literature", limit = 12) {
  // encodeURIComponent makes the text safe for a URL (spaces, &, ? ...)
  const url =
    `${BASE_URL}?q=${encodeURIComponent(query)}` +
    `&limit=${limit}` +
    `&fields=key,title,author_name,first_publish_year,cover_i`;

  const response = await fetch(url);

  // fetch does NOT fail on 404 or 500, so we check it ourselves
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  // Turn each API result into the same shape our cards already use
  return data.docs.map((doc) => ({
    id: doc.key, // e.g. "/works/OL45883W"
    title: doc.title,
    author: doc.author_name ? doc.author_name[0] : "Unknown author",
    year: doc.first_publish_year || null, // null = no year, the card hides it
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));
}