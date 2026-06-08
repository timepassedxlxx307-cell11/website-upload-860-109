(function () {
    var video = document.getElementById('video-player');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-trigger]'));
    var cover = document.querySelector('.player-cover');
    var message = document.querySelector('[data-player-message]');
    var ready = false;
    var hlsInstance = null;

    if (!video || typeof pageVideoSource === 'undefined') {
        return;
    }

    function setMessage(text) {
        if (message) {
            message.textContent = text || '';
        }
    }

    function bindVideo() {
        if (ready) {
            return;
        }
        ready = true;
        setMessage('');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = pageVideoSource;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                maxBufferLength: 30,
                enableWorker: true
            });
            hlsInstance.loadSource(pageVideoSource);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setMessage('播放暂时不可用，请稍后再试');
                    if (hlsInstance) {
                        hlsInstance.destroy();
                        hlsInstance = null;
                    }
                    ready = false;
                }
            });
            return;
        }

        video.src = pageVideoSource;
    }

    function showCover(hidden) {
        if (cover) {
            cover.classList.toggle('is-hidden', hidden);
        }
    }

    function playVideo() {
        bindVideo();
        showCover(true);
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                showCover(false);
                setMessage('点击播放按钮开始播放');
            });
        }
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', playVideo);
    });

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        showCover(true);
        setMessage('');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            showCover(false);
        }
    });
})();
