function initMoviePlayer(streamUrl, videoId, buttonId) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hlsInstance = null;
  var attached = false;
  var readyCallbacks = [];

  if (!video || !button || !streamUrl) {
    return;
  }

  function ready(callback) {
    if (typeof callback === "function") {
      readyCallbacks.push(callback);
    }
  }

  function runReady() {
    while (readyCallbacks.length) {
      var callback = readyCallbacks.shift();
      callback();
    }
  }

  function attachStream() {
    if (attached) {
      runReady();
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", runReady, { once: true });
      video.load();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, runReady);
      hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          button.classList.remove("is-hidden");
        }
      });
      return;
    }

    video.src = streamUrl;
    video.addEventListener("loadedmetadata", runReady, { once: true });
    video.load();
  }

  function playVideo() {
    var result = video.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  function start() {
    button.classList.add("is-hidden");
    video.controls = true;
    ready(playVideo);
    attachStream();
    window.setTimeout(playVideo, 120);
  }

  button.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });
  video.addEventListener("pause", function () {
    if (video.currentTime === 0) {
      button.classList.remove("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
