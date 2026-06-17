/* ========================================
   SUNOVA — Agência Digital Premium
   Main JavaScript
   ======================================== */

(function () {
  'use strict';

  // --- NAVBAR SCROLL ---
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavbar() {
    const sy = window.scrollY;
    if (sy > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = sy;
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });

  // --- MOBILE MENU ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- SCROLL REVEAL ---
  const revealElements = document.querySelectorAll('[data-reveal]');

  function revealOnScroll() {
    var wh = window.innerHeight;
    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var delay = parseInt(el.dataset.delay || '0', 10);
      if (rect.top < wh - 60) {
        setTimeout(function () {
          el.classList.add('revealed');
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  window.addEventListener('load', revealOnScroll);
  // Initial check
  revealOnScroll();

  // --- COUNTER ANIMATION ---
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      countersAnimated = true;
      counters.forEach(function (counter) {
        var target = parseInt(counter.dataset.count, 10);
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // --- PORTFOLIO FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;

      portfolioCards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  // --- VIDEO SECTION ---
  const videoPoster = document.getElementById('videoPoster');
  const videoFrame = document.getElementById('videoFrame');
  // Replace VIDEO_ID with your actual YouTube video ID
  var videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';

  if (videoPoster) {
    videoPoster.addEventListener('click', function () {
      videoPoster.classList.add('hidden');
      videoFrame.src = videoUrl;
    });
  }

  // --- TESTIMONIALS SLIDER ---
  var testimonialsTrack = document.getElementById('testimonialsTrack');
  var testDots = document.getElementById('testDots');
  var prevBtn = document.getElementById('prevTest');
  var nextBtn = document.getElementById('nextTest');
  var testCards = testimonialsTrack ? testimonialsTrack.querySelectorAll('.testimonial-card') : [];
  var currentSlide = 0;
  var totalSlides = testCards.length;
  var autoplayInterval;

  function buildDots() {
    if (!testDots) return;
    testDots.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.className = 'test-dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.dataset.index, 10));
      });
      testDots.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;

    var offset = -(currentSlide * 100);
    testimonialsTrack.style.transform = 'translateX(' + offset + '%)';

    var dots = testDots.querySelectorAll('.test-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  buildDots();

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      resetAutoplay();
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();

  // Touch / swipe support for testimonials
  var touchStartX = 0;
  var touchEndX = 0;

  if (testimonialsTrack) {
    testimonialsTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
        resetAutoplay();
      }
    }, { passive: true });
  }

  // --- BACK TO TOP ---
  var backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight + 20;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- PARALLAX LIGHT EFFECT ON HERO ---
  var heroContent = document.querySelector('.hero-content');
  var heroOrb1 = document.querySelector('.hero-orb-1');
  var heroOrb2 = document.querySelector('.hero-orb-2');

  function handleParallax() {
    var sy = window.scrollY;
    if (sy < window.innerHeight) {
      if (heroOrb1) heroOrb1.style.transform = 'translate(0, ' + (sy * 0.08) + 'px)';
      if (heroOrb2) heroOrb2.style.transform = 'translate(0, ' + (sy * -0.06) + 'px)';
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // --- NAVBAR ACTIVE LINK TRACKING ---
  var sections = document.querySelectorAll('section[id]');
  var navLinksList = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    var sy = window.scrollY + 200;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (sy >= top && sy < top + height) {
        navLinksList.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'rgba(255,255,255,1)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
