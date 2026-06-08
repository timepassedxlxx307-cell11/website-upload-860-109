(function () {
    var input = document.getElementById('global-search-input');
    var category = document.getElementById('global-search-category');
    var button = document.getElementById('global-search-button');
    var results = document.getElementById('search-results');
    var empty = document.getElementById('search-empty');

    if (!input || !category || !button || !results || typeof movieSearchData === 'undefined') {
        return;
    }

    function getQuery() {
        return new URLSearchParams(window.location.search).get('q') || '';
    }

    function createCard(movie) {
        var tags = [movie.title, movie.region, movie.type, movie.genre, movie.year, movie.category].concat(movie.tags || []).join(' ');
        return '<a class="movie-card" href="' + movie.url + '" data-tags="' + escapeHtml(tags) + '">' +
            '<span class="movie-poster">' +
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<i>' + escapeHtml(movie.type) + '</i>' +
            '</span>' +
            '<span class="movie-info">' +
            '<strong>' + escapeHtml(movie.title) + '</strong>' +
            '<em>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.genre) + '</em>' +
            '<small>' + escapeHtml(movie.oneLine || '') + '</small>' +
            '</span>' +
            '</a>';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function render() {
        var keyword = input.value.trim().toLowerCase();
        var selected = category.value;
        var matches = movieSearchData.filter(function (movie) {
            var text = [movie.title, movie.region, movie.type, movie.genre, movie.year, movie.category, movie.oneLine].concat(movie.tags || []).join(' ').toLowerCase();
            if (selected && movie.category !== selected) {
                return false;
            }
            if (keyword && text.indexOf(keyword) === -1) {
                return false;
            }
            return true;
        }).slice(0, 120);

        results.innerHTML = matches.map(createCard).join('');
        empty.hidden = matches.length !== 0;
    }

    input.value = getQuery();
    input.addEventListener('input', render);
    category.addEventListener('change', render);
    button.addEventListener('click', render);
    render();
})();
