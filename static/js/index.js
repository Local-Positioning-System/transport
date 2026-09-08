document.addEventListener('DOMContentLoaded', function () {
  // Video carousel component (kept from the template). Initialises only if a
  // carousel element is present on the page.
  if (typeof bulmaCarousel !== 'undefined' && document.querySelector('.carousel')) {
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: false,
      pagination: false
    });
  }

  // Playback is driven from here rather than by the `autoplay` attribute. The
  // page carries three demo videos, and the carousel clones its slides for the
  // infinite loop, so the document ends up holding a dozen video elements. Left
  // to the attribute they all start together and the browser quietly declines to
  // run them all: only three ever played, and the urban clip - the longest of the
  // three - was consistently one of the ones left sitting on its poster. Playing
  // only what is on screen keeps the count low enough that every video runs, and
  // stops the page pulling ~15 MB of video before anyone scrolls.
  var videos = document.querySelectorAll('video.lps-video');

  function play(video) {
    var attempt = video.play();
    // Rejects if the element is torn down mid-play or the browser declines;
    // neither is worth surfacing, and an unhandled rejection is noisy.
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(videos, play);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        play(entry.target);
      } else if (!entry.target.paused) {
        entry.target.pause();
      }
    });
  }, { threshold: 0.25 });

  Array.prototype.forEach.call(videos, function (video) {
    observer.observe(video);
  });
});
