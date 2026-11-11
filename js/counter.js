/* ====================================================================
   RIVERSTONE ACADEMY — COUNTER.JS
   Handles: animated "count up" effect for the statistics section.
   Counters only start once, when the stats section enters the
   viewport, using requestAnimationFrame for smooth easing.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  var duration = 1800; // ms
  var reducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Ease-out-quad — starts fast, settles smoothly
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var startTime = null;

    // Visitors who ask for reduced motion see the final number straight away
    if (reducedMotion) {
      el.textContent = target.toLocaleString('en-IN') + suffix;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutQuad(progress);
      var current = Math.floor(eased * target);

      el.textContent = current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN') + suffix;
        el.classList.add('done');
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------
     Trigger counters once, when the stats section scrolls into view
  --------------------------------------------------------------- */
  var statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: animate immediately if IntersectionObserver isn't supported
    statNumbers.forEach(animateCount);
    return;
  }

  var hasAnimated = false;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(animateCount);
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);

});
