(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-nav-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-index]"));
            var current = 0;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    showSlide(Number(dot.getAttribute("data-hero-index")) || 0);
                });
            });

            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var grids = Array.prototype.slice.call(document.querySelectorAll("[data-filter-grid]"));
        grids.forEach(function (grid) {
            var scope = grid.closest("[data-filter-scope]") || document;
            var input = scope.querySelector("[data-filter-input]");
            var typeSelect = scope.querySelector("[data-filter-type]");
            var yearSelect = scope.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));
            var empty = scope.querySelector("[data-empty-message]");
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");

            if (query && input && !input.value) {
                input.value = query;
            }

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function applyFilter() {
                var term = normalize(input ? input.value : "");
                var type = normalize(typeSelect ? typeSelect.value : "");
                var year = normalize(yearSelect ? yearSelect.value : "");
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre")
                    ].join(" "));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var matchTerm = !term || haystack.indexOf(term) !== -1;
                    var matchType = !type || cardType === type;
                    var matchYear = !year || cardYear === year;
                    var match = matchTerm && matchType && matchYear;

                    card.style.display = match ? "" : "none";
                    if (match) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, typeSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilter);
                    control.addEventListener("change", applyFilter);
                }
            });

            applyFilter();
        });
    });
}());
