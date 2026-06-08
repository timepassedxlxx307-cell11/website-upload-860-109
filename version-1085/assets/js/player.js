(function () {
    function attachPlayer(video, overlay, source) {
        var attached = false;
        var hlsInstance = null;

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function showOverlay() {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        }

        function tryPlay() {
            hideOverlay();
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    showOverlay();
                });
            }
        }

        function assignSource() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", tryPlay, { once: true });
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, tryPlay);
                return;
            }

            video.src = source;
            video.addEventListener("loadedmetadata", tryPlay, { once: true });
            video.load();
        }

        function start() {
            if (!source) {
                return;
            }

            if (!attached) {
                assignSource();
            } else {
                tryPlay();
            }
        }

        if (overlay) {
            overlay.addEventListener("click", function (event) {
                event.preventDefault();
                start();
            });
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = function (videoId, overlayId, source) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);

        if (!video) {
            return;
        }

        attachPlayer(video, overlay, source);
    };
}());
