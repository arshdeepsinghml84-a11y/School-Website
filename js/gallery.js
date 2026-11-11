/* ====================================================================
   RIVERSTONE ACADEMY — GALLERY.JS
   Handles: gallery category filtering (with fade-out/in) and the
   lightbox popup (open, close, prev/next, keyboard navigation).
   ==================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryGrid = document.getElementById('gallery-grid');

  if (!galleryItems.length) return;

  /* ---------------------------------------------------------------
     1. CATEGORY FILTERING
  --------------------------------------------------------------- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Show/hide matching items with a brief fade transition
      galleryItems.forEach(function (item) {
        var category = item.getAttribute('data-category');
        var matches = filter === 'all' || category === filter;

        if (matches) {
          item.classList.remove('hide');
          item.style.animation = 'fade-in 0.4s ease both';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     2. LIGHTBOX
  --------------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg) return;

  var visibleItems = [];
  var currentIndex = 0;
  var lastFocusedElement = null;

  function getVisibleItems() {
    return Array.prototype.filter.call(galleryItems, function (item) {
      return !item.classList.contains('hide');
    });
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;
    updateLightboxImage();

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();

    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function updateLightboxImage() {
    var item = visibleItems[currentIndex];
    if (!item) return;
    var fullSrc = item.getAttribute('data-full') || item.querySelector('img').src;
    var altText = item.querySelector('img').getAttribute('alt') || '';
    lightboxImg.src = fullSrc;
    lightboxImg.alt = altText;
    // Restart the scale-in animation on each image change
    lightboxImg.style.animation = 'none';
    void lightboxImg.offsetWidth; /* force reflow to restart animation */
    lightboxImg.style.animation = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    // Basic focus trap within the lightbox controls
    if (e.key === 'Tab') {
      var focusable = [prevBtn, nextBtn, closeBtn];
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      var nextIdx = e.shiftKey
        ? (idx <= 0 ? focusable.length - 1 : idx - 1)
        : (idx === focusable.length - 1 ? 0 : idx + 1);
      focusable[nextIdx].focus();
    }
  }

  galleryItems.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      var visible = getVisibleItems();
      var visibleIndex = visible.indexOf(item);
      openLightbox(visibleIndex === -1 ? 0 : visibleIndex);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Click outside the image (on the dark backdrop) closes the lightbox
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

});
