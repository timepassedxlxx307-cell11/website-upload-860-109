(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  var keywordInput = document.getElementById('filterKeyword');
  var regionSelect = document.getElementById('filterRegion');
  var typeSelect = document.getElementById('filterType');
  var yearSelect = document.getElementById('filterYear');
  var resetButton = document.getElementById('filterReset');
  var countNode = document.getElementById('filterCount');
  var filterItems = Array.prototype.slice.call(document.querySelectorAll('.filter-item'));

  function getQueryValue(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter() {
    if (!filterItems.length) {
      return;
    }

    var keyword = normalize(keywordInput ? keywordInput.value : '');
    var region = normalize(regionSelect ? regionSelect.value : '');
    var type = normalize(typeSelect ? typeSelect.value : '');
    var year = normalize(yearSelect ? yearSelect.value : '');
    var visibleCount = 0;

    filterItems.forEach(function (item) {
      var haystack = normalize([
        item.dataset.title,
        item.dataset.region,
        item.dataset.type,
        item.dataset.year,
        item.dataset.genre,
        item.dataset.category
      ].join(' '));

      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }

      if (region && normalize(item.dataset.region).indexOf(region) === -1) {
        matched = false;
      }

      if (type && normalize(item.dataset.type).indexOf(type) === -1) {
        matched = false;
      }

      if (year && normalize(item.dataset.year) !== year) {
        matched = false;
      }

      item.classList.toggle('is-hidden-card', !matched);

      if (matched) {
        visibleCount += 1;
      }
    });

    if (countNode) {
      countNode.textContent = String(visibleCount);
    }
  }

  if (keywordInput) {
    var queryKeyword = getQueryValue('q');

    if (queryKeyword) {
      keywordInput.value = queryKeyword;
    }

    keywordInput.addEventListener('input', applyFilter);
  }

  [regionSelect, typeSelect, yearSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('change', applyFilter);
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      if (keywordInput) {
        keywordInput.value = '';
      }

      if (regionSelect) {
        regionSelect.value = '';
      }

      if (typeSelect) {
        typeSelect.value = '';
      }

      if (yearSelect) {
        yearSelect.value = '';
      }

      applyFilter();
    });
  }

  applyFilter();
})();
