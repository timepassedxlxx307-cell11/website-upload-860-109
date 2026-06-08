document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-to]"));
  var currentSlide = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var index = Number(dot.getAttribute("data-hero-to"));
      showSlide(index);
      startHero();
    });
  });

  startHero();

  document.querySelectorAll("[data-filter-block]").forEach(function (block) {
    var search = block.querySelector("[data-search]");
    var year = block.querySelector("[data-filter-year]");
    var region = block.querySelector("[data-filter-region]");
    var genre = block.querySelector("[data-filter-genre]");
    var cards = Array.prototype.slice.call(block.querySelectorAll(".movie-card"));

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function applyFilters() {
      var query = valueOf(search);
      var selectedYear = valueOf(year);
      var selectedRegion = valueOf(region);
      var selectedGenre = valueOf(genre);

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-genre") || ""
        ].join(" ").toLowerCase();

        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchYear = !selectedYear || (card.getAttribute("data-year") || "").toLowerCase() === selectedYear;
        var matchRegion = !selectedRegion || (card.getAttribute("data-region") || "").toLowerCase().indexOf(selectedRegion) !== -1;
        var matchGenre = !selectedGenre || (card.getAttribute("data-genre") || "").toLowerCase().indexOf(selectedGenre) !== -1 || (card.getAttribute("data-tags") || "").toLowerCase().indexOf(selectedGenre) !== -1;

        card.hidden = !(matchQuery && matchYear && matchRegion && matchGenre);
      });
    }

    [search, year, region, genre].forEach(function (element) {
      if (element) {
        element.addEventListener("input", applyFilters);
        element.addEventListener("change", applyFilters);
      }
    });
  });
});
