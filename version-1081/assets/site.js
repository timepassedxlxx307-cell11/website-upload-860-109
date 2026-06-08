(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function restartTimer() {
    if (!slides.length) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        restartTimer();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartTimer();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartTimer();
      });
    }
    restartTimer();
  }

  var filterScope = document.querySelector('.filter-scope');
  var searchInput = document.querySelector('.js-search');
  var filters = Array.prototype.slice.call(document.querySelectorAll('.js-filter'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!filterScope) {
      return;
    }
    var query = normalize(searchInput ? searchInput.value : '');
    var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card'));
    cards.forEach(function (card) {
      var visible = true;
      var haystack = normalize(card.getAttribute('data-title'));
      if (query && haystack.indexOf(query) === -1) {
        visible = false;
      }
      filters.forEach(function (filter) {
        var key = filter.getAttribute('data-filter');
        var value = normalize(filter.value);
        var cardValue = normalize(card.getAttribute('data-' + key));
        if (value && cardValue.indexOf(value) === -1) {
          visible = false;
        }
      });
      card.classList.toggle('hidden-card', !visible);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  filters.forEach(function (filter) {
    filter.addEventListener('change', applyFilters);
  });

  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');
  if (q && searchInput) {
    searchInput.value = q;
    applyFilters();
  }
}());
