/* ====================================================================
   RIVERSTONE ACADEMY — MAIN.JS
   Handles: preloader, sticky header, hamburger menu, theme toggle,
   scroll-spy, scroll-reveal (IntersectionObserver), typing effect,
   accordion (FAQ), ripple buttons, back-to-top, smooth scroll,
   footer year, parallax hero.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // True when the visitor's device asks for less motion. CSS already
  // shortens animations for these visitors; this lets the JS-driven
  // effects (typing, smooth scrolling) respect it too.
  var prefersReducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------------------------------------------------------
     1. PRELOADER
     Hides the preloader once the window has fully loaded, with a
     minimum display time so it doesn't just "flash" on fast loads.
  --------------------------------------------------------------- */
  (function preloader() {
    var preloaderEl = document.getElementById('preloader');
    if (!preloaderEl) return;

    var minDisplay = 500;
    var start = Date.now();

    function hide() {
      var elapsed = Date.now() - start;
      var wait = Math.max(0, minDisplay - elapsed);
      setTimeout(function () {
        preloaderEl.classList.add('hidden');
      }, wait);
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
    }
  })();

  /* ---------------------------------------------------------------
     2. STICKY / SOLID HEADER ON SCROLL
  --------------------------------------------------------------- */
  var header = document.getElementById('site-header');
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------
     3. HAMBURGER / MOBILE NAV
  --------------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var primaryNav = document.getElementById('primary-nav');

  function closeMobileNav() {
    if (!hamburger || !primaryNav) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    primaryNav.classList.remove('open');
  }

  if (hamburger && primaryNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      primaryNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu after a nav link is clicked (mobile UX)
    primaryNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  /* ---------------------------------------------------------------
     4. THEME TOGGLE (LIGHT / DARK) — persists for this session
  --------------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle && themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      root.removeAttribute('data-theme');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle && themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  }

  // Respect system preference on first load (no persistent storage used)
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  /* ---------------------------------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      // A bare "#" is a placeholder link with no destination yet. Stop the
      // browser's default behaviour, which would jump to the top of the page.
      if (targetId.length < 2) {
        e.preventDefault();
        return;
      }
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ---------------------------------------------------------------
     6. SCROLL SPY — highlights the current section's nav link
  --------------------------------------------------------------- */
  (function scrollSpy() {
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    // The link this page's HTML marks as current (e.g. "Academics" on
    // academics.html). Sections without a menu link of their own fall back
    // to it, instead of wiping the highlight from every link.
    var pageLink = document.querySelector('.nav-link.active-link');

    function setActive(activeLink) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active-link', link === activeLink);
      });
    }

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        var match = null;
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href') || '';
          if (href.split('#')[1] === id) match = link;
        });
        setActive(match || pageLink);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  })();

  /* ---------------------------------------------------------------
     7. SCROLL REVEAL — fades/slides elements in on viewport entry
  --------------------------------------------------------------- */
  (function scrollReveal() {
    var revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    // Once an element has finished revealing, drop its reveal classes and
    // stagger delay. Otherwise the reveal transition (0.7s plus the stagger
    // delay) keeps overriding the element's own hover transition, so cards
    // react slowly, and later cards react even later, when hovered.
    function finishReveal(el) {
      var done = false;
      function strip() {
        if (done) return;
        done = true;
        el.removeEventListener('transitionend', onEnd);
        el.classList.remove('reveal-up', 'reveal-left', 'reveal-right', 'visible');
        el.removeAttribute('data-delay');
      }
      function onEnd(e) {
        if (e.target === el && e.propertyName === 'opacity') strip();
      }
      el.addEventListener('transitionend', onEnd);
      setTimeout(strip, 2500); // safety net if no transition event arrives
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
          finishReveal(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------------------------------------------------------------
     8. TYPING EFFECT FOR HERO HEADLINE
  --------------------------------------------------------------- */
  (function typingEffect() {
    var el = document.getElementById('typing-target');
    if (!el) return;
    if (prefersReducedMotion) return; // leave the full headline in place

    var fullText = el.textContent.trim();
    el.textContent = '';
    el.classList.add('typing');

    var i = 0;
    function type() {
      if (i <= fullText.length) {
        el.textContent = fullText.slice(0, i);
        i++;
        setTimeout(type, 35);
      } else {
        // Stop the blinking cursor a moment after typing completes
        setTimeout(function () { el.classList.remove('typing'); }, 1200);
      }
    }
    setTimeout(type, 400);
  })();

  /* ---------------------------------------------------------------
     9. ACCORDION (FAQ)
  --------------------------------------------------------------- */
  (function accordion() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));

        // Close all other panels (single-open accordion behaviour)
        triggers.forEach(function (t) {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) p.hidden = true;
          }
        });

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  })();

  /* ---------------------------------------------------------------
     10. RIPPLE EFFECT ON BUTTONS
  --------------------------------------------------------------- */
  document.querySelectorAll('.btn-ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 600);
    });
  });

  /* ---------------------------------------------------------------
     11. BACK TO TOP BUTTON
  --------------------------------------------------------------- */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     12. SUBTLE HERO PARALLAX
  --------------------------------------------------------------- */
  (function parallaxHero() {
    var heroImg = document.querySelector('.hero-img');
    var hero = document.querySelector('.hero');
    if (!heroImg || !hero) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > hero.offsetHeight) return;
      var offset = window.scrollY * 0.25;
      heroImg.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------
     13. FOOTER YEAR
  --------------------------------------------------------------- */
  var footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------
     14. NEWSLETTER FORM (lightweight, no backend — demo confirmation)
  --------------------------------------------------------------- */
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('newsletter-email');
      var btn = newsletterForm.querySelector('button[type="submit"]');
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }
      var originalText = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      emailInput.value = '';
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2500);
    });
  }

});
