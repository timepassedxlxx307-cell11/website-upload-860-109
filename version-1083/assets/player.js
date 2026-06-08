function initVideoPlayer(videoId, buttonId, mediaUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hlsInstance = null;

  if (!video || !button || !mediaUrl) {
    return;
  }

  function attachSource() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== mediaUrl) {
        video.src = mediaUrl;
      }
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(mediaUrl);
        hlsInstance.attachMedia(video);
      }
      return Promise.resolve();
    }

    if (video.src !== mediaUrl) {
      video.src = mediaUrl;
    }

    return Promise.resolve();
  }

  function start() {
    button.classList.add('is-hidden');
    attachSource().then(function () {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    });
  }

  button.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
}
