(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    window.setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-card-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var query = normalize(searchInput ? searchInput.value : '');

    cards.forEach(function(card) {
      var searchText = normalize(card.getAttribute('data-search'));
      var category = card.getAttribute('data-category') || '';
      var matchQuery = !query || searchText.indexOf(query) !== -1;
      var matchFilter = activeFilter === 'all' || category === activeFilter;
      card.classList.toggle('is-filter-hidden', !(matchQuery && matchFilter));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function(item) {
        item.classList.toggle('active', item === button);
      });
      applyFilters();
    });
  });
})();
