(function () {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (button && menu) {
        button.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var keyword = input ? input.value.trim() : '';
            var url = './search.html';
            if (keyword) {
                url += '?q=' + encodeURIComponent(keyword);
            }
            window.location.href = url;
        });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    var filterInput = document.querySelector('.js-card-filter');
    var typeSelect = document.querySelector('.js-filter-type');
    var yearSelect = document.querySelector('.js-filter-year');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.filterable-grid .movie-card'));
    var emptyTip = document.querySelector('.empty-tip');

    function applyLocalFilter() {
        if (!cards.length) {
            return;
        }
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-tags') || '').toLowerCase();
            var cardType = card.getAttribute('data-type') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }
            if (type && cardType !== type) {
                matched = false;
            }
            if (year && cardYear !== year) {
                matched = false;
            }

            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });

        if (emptyTip) {
            emptyTip.hidden = visible !== 0;
        }
    }

    [filterInput, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyLocalFilter);
            control.addEventListener('change', applyLocalFilter);
        }
    });
})();
