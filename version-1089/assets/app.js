(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var opened = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    show(0);
    restart();
  }

  function setupScrollers() {
    Array.prototype.slice.call(document.querySelectorAll("[data-scroller]")).forEach(function (wrap) {
      var scroller = wrap.querySelector(".horizontal-scroller");
      var left = wrap.querySelector(".scroll-button.left");
      var right = wrap.querySelector(".scroll-button.right");
      if (!scroller) {
        return;
      }
      function move(distance) {
        scroller.scrollBy({ left: distance, behavior: "smooth" });
      }
      if (left) {
        left.addEventListener("click", function () {
          move(-420);
        });
      }
      if (right) {
        right.addEventListener("click", function () {
          move(420);
        });
      }
    });
  }

  function setupFilters() {
    Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]")).forEach(function (input) {
      var grid = document.querySelector(input.getAttribute("data-filter-input"));
      var empty = document.querySelector(input.getAttribute("data-empty-target"));
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
      function apply() {
        var query = input.value.trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {
          var keywords = (card.getAttribute("data-keywords") || card.textContent || "").toLowerCase();
          var match = !query || keywords.indexOf(query) !== -1;
          card.style.display = match ? "" : "none";
          if (match) {
            shown += 1;
          }
        });
        if (empty) {
          empty.style.display = shown ? "none" : "block";
        }
      }
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        input.value = q;
      }
      input.addEventListener("input", apply);
      apply();
    });
  }

  var hlsPromise = null;

  function ensureHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (!hlsPromise) {
      hlsPromise = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
        script.async = true;
        script.onload = function () {
          resolve(window.Hls);
        };
        script.onerror = function () {
          reject(new Error("hls-load-error"));
        };
        document.head.appendChild(script);
      });
    }
    return hlsPromise;
  }

  function setupPlayers() {
    Array.prototype.slice.call(document.querySelectorAll(".movie-player")).forEach(function (player) {
      var video = player.querySelector("video");
      var source = video ? video.getAttribute("data-src") : "";
      var playButton = player.querySelector(".player-play");
      var status = player.querySelector(".player-status");
      var initialized = false;
      var initializing = null;
      var hlsInstance = null;

      if (!video || !source) {
        return;
      }

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function initialize() {
        if (initialized) {
          return Promise.resolve();
        }
        if (initializing) {
          return initializing;
        }
        setStatus("正在准备播放");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          initialized = true;
          setStatus("点击播放");
          return Promise.resolve();
        }
        initializing = ensureHls().then(function (Hls) {
          if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
              setStatus("点击播放");
            });
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                setStatus("视频加载失败，请稍后重试");
              }
            });
            initialized = true;
            return;
          }
          throw new Error("hls-not-supported");
        }).catch(function () {
          setStatus("当前浏览器暂不支持播放");
        });
        return initializing;
      }

      function play() {
        initialize().then(function () {
          var playResult = video.play();
          if (playResult && typeof playResult.then === "function") {
            playResult.then(function () {
              player.classList.add("is-playing");
              setStatus("正在播放");
            }).catch(function () {
              setStatus("请再次点击播放");
            });
          } else {
            player.classList.add("is-playing");
            setStatus("正在播放");
          }
        });
      }

      if (playButton) {
        playButton.addEventListener("click", function (event) {
          event.preventDefault();
          play();
        });
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener("play", function () {
        player.classList.add("is-playing");
        setStatus("正在播放");
      });
      video.addEventListener("pause", function () {
        player.classList.remove("is-playing");
        setStatus("已暂停");
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
      initialize();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupScrollers();
    setupFilters();
    setupPlayers();
  });
})();
