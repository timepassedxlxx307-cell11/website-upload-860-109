(function () {
  var form = document.querySelector("[data-search-form]");
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var empty = document.querySelector("[data-search-empty]");
  var params = new URLSearchParams(window.location.search);
  var initialKeyword = params.get("q") || "";

  function card(movie) {
    return [
      '<article class="movie-card compact-card" data-title="' +
        escapeHtml(movie.title) +
        '" data-region="' +
        escapeHtml(movie.region) +
        '" data-genre="' +
        escapeHtml(movie.genre) +
        '">',
      '  <a class="poster-wrap" href="' +
        movie.url +
        '" aria-label="观看' +
        escapeHtml(movie.title) +
        '">',
      '    <img src="' +
        movie.cover +
        '" alt="' +
        escapeHtml(movie.title) +
        '" loading="lazy" onerror="this.onerror=null;this.classList.add(\'image-hidden\');">',
      '    <span class="poster-shade"></span>',
      '    <span class="year-pill">' + escapeHtml(movie.year) + "</span>",
      "  </a>",
      '  <div class="card-body">',
      '    <h3><a href="' +
        movie.url +
        '">' +
        escapeHtml(movie.title) +
        "</a></h3>",
      "    <p>" + escapeHtml(movie.oneLine) + "</p>",
      '    <div class="card-meta"><span>' +
        escapeHtml(movie.region) +
        "</span><span>" +
        escapeHtml(movie.type) +
        '</span><a href="' +
        movie.categoryUrl +
        '">' +
        escapeHtml(movie.category) +
        "</a></div>",
      "  </div>",
      "</article>",
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function search(keyword) {
    var words = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var source = window.MOVIE_INDEX || [];
    var matched = source
      .filter(function (movie) {
        var haystack = [
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          movie.oneLine,
          movie.category,
        ]
          .join(" ")
          .toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) > -1;
        });
      })
      .slice(0, 96);

    if (!results || !empty) {
      return;
    }

    if (!words.length) {
      matched = source.slice(0, 48);
    }

    results.innerHTML = matched.map(card).join("");
    empty.style.display = matched.length ? "none" : "block";
  }

  if (input) {
    input.value = initialKeyword;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      search(input ? input.value : "");
    });
  }

  search(initialKeyword);
})();
