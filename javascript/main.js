/* ============================================
   SPRINGFIELD COLLEGE – MAIN JS
   js/main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- MOBILE NAVIGATION ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('active');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  }


  /* ---- STICKY HEADER SHADOW ON SCROLL ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
      } else {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
      }
    });
  }


  /* ---- SCROLL REVEAL ANIMATION ---- */
  // Simple fade-in-up animation for cards and sections as they scroll into view
  const revealElements = document.querySelectorAll(
    '.feature-card, .notice-item, .event-card, .about-split, .cta-strip, ' +
    '.mvv-card, .why-item, .team-card, .affil-item, .story-stats-row'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ---- HERO SLIDESHOW ---- */
  (function () {
    var slideshow    = document.getElementById('heroSlideshow');
    if (!slideshow) return;

    var heroEl       = document.getElementById('hero');
    var slides       = slideshow.querySelectorAll('.hero-slide');
    var dotsWrap     = document.getElementById('heroDots');
    var prevBtn      = document.getElementById('heroPrev');
    var nextBtn      = document.getElementById('heroNext');
    var playPauseBtn = document.getElementById('heroPlayPause');
    var progressFill = document.getElementById('heroProgressFill');
    var iconPause    = playPauseBtn ? playPauseBtn.querySelector('.icon-pause') : null;
    var iconPlay     = playPauseBtn ? playPauseBtn.querySelector('.icon-play')  : null;

    var current      = 0;
    var total        = slides.length;
    var INTERVAL     = 3000;   // ms between slides
    var isPlaying    = true;
    var timer        = null;
    var progressTimer = null;

    if (total < 2) return; // nothing to slide if only one image

    /* Build dot indicators */
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className   = 'hero-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function getDots() {
      return dotsWrap ? dotsWrap.querySelectorAll('.hero-dot') : [];
    }

    function goTo(index) {
      slides[current].classList.remove('active');
      var dots = getDots();
      if (dots[current]) {
        dots[current].classList.remove('active');
        dots[current].setAttribute('aria-selected', 'false');
      }

      current = (index + total) % total;

      slides[current].classList.add('active');
      if (dots[current]) {
        dots[current].classList.add('active');
        dots[current].setAttribute('aria-selected', 'true');
      }

      resetProgress();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    /* Auto-play */
    function startTimer() {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    }
    function stopTimer() {
      clearInterval(timer);
    }

    /* Progress bar */
    function resetProgress() {
      if (!progressFill) return;
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      // Force reflow so the reset registers before the new transition
      progressFill.offsetWidth; // eslint-disable-line
      if (isPlaying) {
        progressFill.style.transition = 'width ' + INTERVAL + 'ms linear';
        progressFill.style.width = '100%';
      }
    }

    /* Play / Pause */
    function play() {
      isPlaying = true;
      startTimer();
      resetProgress();
      if (iconPause) iconPause.style.display = '';
      if (iconPlay)  iconPlay.style.display  = 'none';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    }
    function pause() {
      isPlaying = false;
      stopTimer();
      if (progressFill) {
        progressFill.style.transition = 'none';
      }
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay)  iconPlay.style.display  = '';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    }

    /* Button listeners */
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); if (isPlaying) { stopTimer(); startTimer(); resetProgress(); } });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); if (isPlaying) { stopTimer(); startTimer(); resetProgress(); } });
    if (playPauseBtn) playPauseBtn.addEventListener('click', function () { isPlaying ? pause() : play(); });

    /* Pause on hover */
    // var heroEl = document.getElementById('hero');
    // if (heroEl) {
    //   heroEl.addEventListener('mouseenter', function () { if (isPlaying) { stopTimer(); if (progressFill) progressFill.style.transition = 'none'; } });
    //   heroEl.addEventListener('mouseleave', function () { if (isPlaying) { startTimer(); resetProgress(); } });
    // }

    /* Keyboard support (arrow keys when focus is inside hero) */
    if (heroEl) {
      heroEl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); }
        if (e.key === 'ArrowRight') { goTo(current + 1); }
      });
    }

    /* Touch swipe */
    var touchStartX = 0;
    if (heroEl) {
      heroEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      heroEl.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev();
          if (isPlaying) { stopTimer(); startTimer(); resetProgress(); }
        }
      }, { passive: true });
    }

    /* Respect prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // pause();
      slides.forEach(function (s) { s.style.transition = 'none'; s.style.animation = 'none'; });
      // return;
    }

    /* Kick off */
    play();
  })();


  /* ---- TEAM PHOTO FALLBACK (About page) ---- */
  // If a staff photo fails to load, show the initials fallback div instead
  document.querySelectorAll('.team-photo').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      var fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('team-photo-fallback')) {
        fallback.style.opacity = '1';
      }
    });
  });


  /* ---- ACTIVE NAV LINK (highlight current page) ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});


/* ---- SCROLL REVEAL CSS INJECTION ---- */
// Inject the reveal animation styles programmatically so they stay in one file
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
})();