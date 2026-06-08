(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var links = document.querySelector('[data-nav-links]');
    if (!button || !links) {
      return;
    }
    button.addEventListener('click', function () {
      links.classList.toggle('is-open');
      button.setAttribute('aria-expanded', links.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var scopeSelector = panel.getAttribute('data-filter-panel');
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      if (!scope) {
        return;
      }
      var input = panel.querySelector('[data-filter-search]');
      var year = panel.querySelector('[data-filter-year]');
      var type = panel.querySelector('[data-filter-type]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-empty-result]');

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedType = type ? type.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region')).toLowerCase();
          var cardYear = card.getAttribute('data-year');
          var cardType = card.getAttribute('data-type');
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && cardType !== selectedType) {
            matched = false;
          }
          card.style.display = matched ? '' : 'none';
          if (matched) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var cover = shell.querySelector('[data-play-cover]');
      if (!video) {
        return;
      }
      var stream = video.getAttribute('data-stream');
      var loaded = false;

      function loadAndPlay() {
        if (!stream) {
          return;
        }
        if (!loaded) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
          } else {
            video.src = stream;
          }
          loaded = true;
        }
        if (cover) {
          cover.classList.add('is-hidden');
        }
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener('click', loadAndPlay);
      }
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          loadAndPlay();
        }
      });
    });
  }
})();
