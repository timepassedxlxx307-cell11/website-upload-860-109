function attachMoviePlayer(video, trigger, source) {
  if (!video || !source) {
    return;
  }

  var hasStarted = false;
  var hlsInstance = null;

  function hideTrigger() {
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  }

  function bindSource() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    if (!hasStarted) {
      bindSource();
      hasStarted = true;
    }

    hideTrigger();
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function() {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function() {
    if (!hasStarted) {
      startPlayback();
    }
  });

  video.addEventListener('play', hideTrigger);
  window.addEventListener('beforeunload', function() {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
}
