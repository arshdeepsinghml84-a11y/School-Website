/* ====================================================================
   RIVERSTONE ACADEMY — SLIDER.JS
   Handles: testimonials auto-slider — dot navigation, autoplay,
   pause-on-hover/focus, and touch swipe support.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var sliderWrap = document.getElementById('testimonial-slider');
  var track = document.getElementById('testimonial-track');
  var dotsWrap = document.getElementById('testimonial-dots');

  if (!sliderWrap || !track || !dotsWrap) return;

  var slides = Array.prototype.slice.call(track.children);
  if (!slides.length) return;

  var currentSlide = 0;
  var autoplayDelay = 6000;
  var autoplayTimer = null;

  /* ---------------------------------------------------------------
     1. BUILD DOTS
  --------------------------------------------------------------- */
  slides.forEach(function (slide, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Show testimonial ' + (index + 1) + ' of ' + slides.length);
    dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', function () {
      goToSlide(index);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);

  /* ---------------------------------------------------------------
     2. CORE SLIDE LOGIC
  --------------------------------------------------------------- */
  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  /* ---------------------------------------------------------------
     3. AUTOPLAY (pauses on hover / keyboard focus within slider)
  --------------------------------------------------------------- */
  var reducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function startAutoplay() {
    stopAutoplay();
    // Visitors who ask for reduced motion get no self-moving slides;
    // the dots and swipe gestures still work.
    if (reducedMotion) return;
    autoplayTimer = setInterval(nextSlide, autoplayDelay);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }
  function restartAutoplay() {
    startAutoplay();
  }

  sliderWrap.addEventListener('mouseenter', stopAutoplay);
  sliderWrap.addEventListener('mouseleave', startAutoplay);
  sliderWrap.addEventListener('focusin', stopAutoplay);
  sliderWrap.addEventListener('focusout', startAutoplay);

  /* ---------------------------------------------------------------
     4. TOUCH SWIPE SUPPORT
  --------------------------------------------------------------- */
  var touchStartX = 0;
  var touchEndX = 0;
  var swipeThreshold = 40;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var delta = touchEndX - touchStartX;
    if (Math.abs(delta) > swipeThreshold) {
      if (delta < 0) nextSlide(); else prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  /* ---------------------------------------------------------------
     5. INIT
  --------------------------------------------------------------- */
  goToSlide(0);
  startAutoplay();

});
