import { H as Hls } from "./hls-vendor-dru42stk.js";

function readSource() {
  var sourceNode = document.getElementById("movie-source");

  if (!sourceNode) {
    return null;
  }

  try {
    return JSON.parse(sourceNode.textContent);
  } catch (error) {
    return null;
  }
}

function initPlayer() {
  var data = readSource();
  var video = document.querySelector("[data-video-player]");
  var overlay = document.querySelector("[data-player-overlay]");

  if (!data || !data.src || !video) {
    return;
  }

  var loaded = false;
  var hlsInstance = null;

  function loadSource() {
    if (loaded) {
      return Promise.resolve();
    }

    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = data.src;
      return Promise.resolve();
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsInstance.loadSource(data.src);
      hlsInstance.attachMedia(video);
      window.movieHlsPlayer = hlsInstance;

      return new Promise(function (resolve) {
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
      });
    }

    video.src = data.src;
    return Promise.resolve();
  }

  function startPlayback() {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    loadSource().then(function () {
      var playResult = video.play();

      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.addEventListener("DOMContentLoaded", initPlayer);
