(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function bindMobileMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function bindHeroCarousel() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === active);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(active + 1);
            }, 6200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                restart();
            });
        }

        restart();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function renderSearchResults(input, panel, query) {
        var data = window.MOVIE_INDEX || [];
        var keyword = normalize(query);
        if (!keyword) {
            panel.classList.remove("visible");
            panel.innerHTML = "";
            return;
        }

        var matches = data.filter(function (item) {
            return normalize(item.title).indexOf(keyword) !== -1 ||
                normalize(item.genre).indexOf(keyword) !== -1 ||
                normalize(item.region).indexOf(keyword) !== -1 ||
                normalize(item.type).indexOf(keyword) !== -1 ||
                normalize(item.category).indexOf(keyword) !== -1 ||
                normalize(item.year).indexOf(keyword) !== -1;
        }).slice(0, 18);

        if (!matches.length) {
            panel.innerHTML = '<div class="search-empty">没有找到相关影片</div>';
            panel.classList.add("visible");
            return;
        }

        panel.innerHTML = matches.map(function (item) {
            return '<a class="search-item" href="' + item.href + '">' +
                '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
                '<span><strong>' + escapeHtml(item.title) + '</strong>' +
                '<small>' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + ' · ' + escapeHtml(item.year) + '</small>' +
                '<small>' + escapeHtml(item.summary) + '</small></span>' +
                '</a>';
        }).join("");
        panel.classList.add("visible");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function bindGlobalSearch() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("form"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
            });
        });

        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-global-search]"));
        inputs.forEach(function (input) {
            var panel = input.parentElement.querySelector("[data-search-results]");
            if (!panel) {
                return;
            }
            input.addEventListener("input", function () {
                renderSearchResults(input, panel, input.value);
            });
            input.addEventListener("focus", function () {
                renderSearchResults(input, panel, input.value);
            });
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".header-search") && !event.target.closest(".quick-search") && !event.target.closest(".mobile-search")) {
                Array.prototype.slice.call(document.querySelectorAll("[data-search-results]")).forEach(function (panel) {
                    panel.classList.remove("visible");
                });
            }
        });
    }

    function bindLocalFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        if (!panel) {
            return;
        }
        var textInput = panel.querySelector("[data-local-filter]");
        var typeSelect = panel.querySelector("[data-type-filter]");
        var yearSelect = panel.querySelector("[data-year-filter]");
        var reset = panel.querySelector("[data-reset-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var count = document.querySelector("[data-filter-count]");

        function apply() {
            var keyword = normalize(textInput && textInput.value);
            var typeValue = normalize(typeSelect && typeSelect.value);
            var yearValue = normalize(yearSelect && yearSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var title = normalize(card.getAttribute("data-title"));
                var genre = normalize(card.getAttribute("data-genre"));
                var region = normalize(card.getAttribute("data-region"));
                var type = normalize(card.getAttribute("data-type"));
                var year = normalize(card.getAttribute("data-year"));
                var textMatched = !keyword || title.indexOf(keyword) !== -1 || genre.indexOf(keyword) !== -1 || region.indexOf(keyword) !== -1 || type.indexOf(keyword) !== -1 || year.indexOf(keyword) !== -1;
                var typeMatched = !typeValue || type === typeValue;
                var yearMatched = !yearValue || year === yearValue;
                var show = textMatched && typeMatched && yearMatched;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = "当前显示 " + visible + " 部影片";
            }
        }

        [textInput, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        if (reset) {
            reset.addEventListener("click", function () {
                if (textInput) {
                    textInput.value = "";
                }
                if (typeSelect) {
                    typeSelect.value = "";
                }
                if (yearSelect) {
                    yearSelect.value = "";
                }
                apply();
            });
        }
    }

    window.initMoviePlayer = function (videoUrl) {
        onReady(function () {
            var video = document.querySelector("[data-player-video]");
            var trigger = document.querySelector("[data-player-trigger]");
            if (!video || !trigger || !videoUrl) {
                return;
            }
            var attached = false;
            var hlsInstance = null;

            function attachSource() {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoUrl;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(videoUrl);
                    hlsInstance.attachMedia(video);
                    return;
                }
                video.src = videoUrl;
            }

            function playVideo() {
                attachSource();
                trigger.classList.add("hidden");
                video.controls = true;
                var request = video.play();
                if (request && typeof request.catch === "function") {
                    request.catch(function () {
                        trigger.classList.remove("hidden");
                    });
                }
            }

            trigger.addEventListener("click", playVideo);
            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    };

    onReady(function () {
        bindMobileMenu();
        bindHeroCarousel();
        bindGlobalSearch();
        bindLocalFilters();
    });
})();
