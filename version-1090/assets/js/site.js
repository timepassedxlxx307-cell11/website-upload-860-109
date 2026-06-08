(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-mobile-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(
    document.querySelectorAll("[data-hero-slide]"),
  );
  var dots = Array.prototype.slice.call(
    document.querySelectorAll("[data-hero-dot]"),
  );
  var index = 0;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, currentIndex) {
      slide.classList.toggle("active", currentIndex === index);
    });

    dots.forEach(function (dot, currentIndex) {
      dot.classList.toggle("active", currentIndex === index);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("[data-card-filter]");
  var filterCards = Array.prototype.slice.call(
    document.querySelectorAll("[data-title]"),
  );

  if (filterInput && filterCards.length) {
    filterInput.addEventListener("input", function () {
      var keyword = filterInput.value.trim().toLowerCase();

      filterCards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
        ]
          .join(" ")
          .toLowerCase();

        card.style.display = haystack.indexOf(keyword) > -1 ? "" : "none";
      });
    });
  }
})();
