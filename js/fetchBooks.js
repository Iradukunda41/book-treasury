// Get real books from the Open Library API.
const BASE_URL = "https://openlibrary.org/search.json";
const TIMEOUT_MS = 8000; // give up on one attempt after 8 seconds
const MAX_ATTEMPTS = 2; // try twice before showing an error

// fetch that stops waiting after TIMEOUT_MS (instead of hanging for a long time)
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Ask the API for books matching `query` and return a clean list.
export async function fetchBooks(query = "african literature", limit = 12) {
  const url =
    `${BASE_URL}?q=${encodeURIComponent(query)}` +
    `&limit=${limit}` +
    `&fields=key,title,author_name,first_publish_year,cover_i`;

  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(url);

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
    } catch (error) {
      lastError = error;

      // wait one second, then try again (unless this was the last attempt)
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // every attempt failed: home.js will show the error message
  throw lastError;
}