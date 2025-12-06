// Get your TMDB API key from: https://www.themoviedb.org/
// Create an account -> Settings -> API -> Request API key (v3).
const API_KEY = "YOUR_TMDB_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");
const messageEl = document.getElementById("message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    showMessage("Please enter a movie name.");
    resultsContainer.innerHTML = "";
    return;
  }

  searchMovies(query);
});

async function searchMovies(query) {
  showMessage("Searching...");
  resultsContainer.innerHTML = "";

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&include_adult=false`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch movies. Try again later.");
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      showMessage("No movies found.");
      return;
    }

    showMessage(`Found ${data.results.length} result(s).`);
    renderMovies(data.results);
  } catch (err) {
    showMessage(err.message || "Something went wrong.");
  }
}

function renderMovies(movies) {
  resultsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    if (movie.poster_path) {
      img.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
      img.alt = movie.title;
    } else {
      img.alt = "No poster available";
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = movie.title;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
    const rating =
      typeof movie.vote_average === "number"
        ? movie.vote_average.toFixed(1)
        : "N/A";
    meta.textContent = `Year: ${year} | Rating: ${rating}`;

    const overview = document.createElement("div");
    overview.className = "card-overview";
    overview.textContent = movie.overview || "No description available.";

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(overview);

    card.appendChild(img);
    card.appendChild(body);

    resultsContainer.appendChild(card);
  });
}

function showMessage(text) {
  messageEl.textContent = text;
}
