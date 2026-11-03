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
  var hero = document.getElementById('hero-carousel');
  var videos = Array.prototype.filter.call(document.querySelectorAll('video.lps-video'), function (v) {
    return !hero || !hero.contains(v);
  });

  function play(video) {
    var attempt = video.play();
    // Rejects if the element is torn down mid-play or the browser declines;
    // neither is worth surfacing, and an unhandled rejection is noisy.
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (hero) {
    heroCarousel(hero, play);
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


// The hero shows three videos: the front one plays once, then all slide one place on. Items carry an offset from the
// front (-1, 0, 1 on screen); the rest wait off screen on the side they will leave by or enter from.
function heroCarousel(hero, play) {
  var items = Array.prototype.slice.call(hero.querySelectorAll('.item'));
  var caption = hero.parentNode.querySelector('.lps-hero-caption');
  var n = items.length;
  var front = 0;
  var offsets = items.map(function () { return 99; });
  var inView = true;
  var SPACING = 0.66, SIDE_SCALE = 0.78;

  function place(item, off) {
    var w = item.offsetWidth;
    var hidden = Math.abs(off) > 1;
    item.style.transform = 'translate(' + (-w / 2 + off * SPACING * w) + 'px, -50%) scale(' +
      (off === 0 ? 1 : hidden ? 0.6 : SIDE_SCALE) + ')';
    item.style.opacity = off === 0 ? 1 : hidden ? 0 : 0.6;
    item.style.filter = off === 0 ? 'none' : 'brightness(0.75)';
    item.style.zIndex = off === 0 ? 3 : hidden ? 1 : 2;
    item.classList.toggle('is-front', off === 0);
  }

  function layout(dir, animate) {
    items.forEach(function (item, k) {
      var off = ((k - front) % n + n + 1) % n - 1;
      if (off > 1) {
        off = dir < 0 ? 2 : -2;
      }
      var was = offsets[k];
      if (!animate || (Math.abs(was) > 1 && Math.abs(off) <= 1)) {
        // entering: start just off screen on the side it comes in from, without a transition
        item.style.transition = 'none';
        place(item, animate ? (off >= 0 ? 2 : -2) : off);
        void item.offsetWidth;
        item.style.transition = '';
      }
      if (animate || was !== off) {
        place(item, off);
      }
      offsets[k] = off;
      var v = item.querySelector('video');
      if (off === 0) {
        v.currentTime = 0;
        if (inView) {
          play(v);
        }
      } else if (!v.paused) {
        v.pause();
      }
    });
    if (caption) {
      caption.innerHTML = items[front].querySelector('.lps-carousel-caption').innerHTML;
    }
  }

  function go(dir) {
    front = (front + dir + n) % n;
    layout(dir, true);
  }

  items.forEach(function (item, k) {
    var v = item.querySelector('video');
    v.loop = false;
    v.addEventListener('ended', function () {
      if (k === front) {
        go(1);
      }
    });
    item.addEventListener('click', function () {
      if (offsets[k] === 1 || offsets[k] === -1) {
        go(offsets[k]);
      }
    });
  });
  hero.querySelector('.lps-hero-prev').addEventListener('click', function () { go(-1); });
  hero.querySelector('.lps-hero-next').addEventListener('click', function () { go(1); });
  window.addEventListener('resize', function () {
    items.forEach(function (item, k) { item.style.transition = 'none'; place(item, offsets[k]); });
    void hero.offsetWidth;
    items.forEach(function (item) { item.style.transition = ''; });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      var v = items[front].querySelector('video');
      if (inView) {
        play(v);
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: 0.25 }).observe(hero);
  }
  layout(1, false);
}
