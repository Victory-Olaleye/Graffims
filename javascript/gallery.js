document.addEventListener('DOMContentLoaded', function () {

    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allItems = document.querySelectorAll('.gallery-item');
    const noResults = document.getElementById('noResults');
    const visibleCount = document.getElementById('visibleCount');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    /* --------------------------------------------------------
       CATEGORY FILTER
    -------------------------------------------------------- */
    let currentFilter = 'all';

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-filter');
            if (filter === currentFilter) return;
            currentFilter = filter;

            // Update active button
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            filterGallery(filter);
        });
    });

    function filterGallery(filter) {
        let shown = 0;

        allItems.forEach(function (item) {
            const cat = item.getAttribute('data-category');
            const match = filter === 'all' || cat === filter;

            if (match) {
                item.classList.remove('hidden');
                item.classList.remove('hiding');
                item.classList.add('showing');
                // Remove animation class after it completes
                setTimeout(function () { item.classList.remove('showing'); }, 400);
                shown++;
            } else {
                item.classList.add('hiding');
                setTimeout(function () {
                    item.classList.add('hidden');
                    item.classList.remove('hiding');
                }, 260);
            }
        });

        // Update count with slight delay so hidden items are counted correctly
        setTimeout(function () {
            const actuallyVisible = galleryGrid.querySelectorAll('.gallery-item:not(.hidden)').length;
            if (visibleCount) visibleCount.textContent = actuallyVisible;

            if (noResults) {
                noResults.style.display = actuallyVisible === 0 ? 'block' : 'none';
            }
        }, 300);
    }


    /* --------------------------------------------------------
       VIEW TOGGLE (Grid / List)
    -------------------------------------------------------- */
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function () {
            galleryGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function () {
            galleryGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }


    /* --------------------------------------------------------
       IMAGE FALLBACK
       Show coloured gradient when photo hasn't been added yet
    -------------------------------------------------------- */
    document.querySelectorAll('.gallery-item img').forEach(function (img) {
        img.addEventListener('error', function () {
            img.style.display = 'none';
            var fallback = img.parentElement.querySelector('.gallery-img-fallback');
            if (fallback) fallback.style.opacity = '1';
        });
    });


    /* --------------------------------------------------------
       LIGHTBOX
    -------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxFallback = document.getElementById('lightboxFallback');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return Array.from(allItems).filter(function (item) {
            return !item.classList.contains('hidden');
        });
    }

    function openLightbox(index) {
        visibleItems = getVisibleItems();
        if (visibleItems.length === 0) return;

        currentIndex = index;
        showLightboxItem(currentIndex);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showLightboxItem(index) {
        visibleItems = getVisibleItems();
        if (visibleItems.length === 0) return;

        // Clamp index
        if (index < 0) index = visibleItems.length - 1;
        if (index >= visibleItems.length) index = 0;
        currentIndex = index;

        const item = visibleItems[currentIndex];
        const imgEl = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || '';
        const cat = item.getAttribute('data-category') || '';

        // Set lightbox image with fade
        lightboxImg.style.opacity = '0';
        lightboxFallback.classList.remove('visible');
        lightboxImg.style.display = 'block';

        lightboxImg.onload = function () {
            lightboxImg.style.opacity = '1';
        };
        lightboxImg.onerror = function () {
            lightboxImg.style.display = 'none';
            lightboxFallback.classList.add('visible');
        };

        if (imgEl && imgEl.src && !imgEl.src.endsWith('/') && imgEl.naturalWidth > 0) {
            lightboxImg.src = imgEl.src;
            lightboxImg.alt = imgEl.alt || caption;
        } else {
            lightboxImg.src = imgEl ? imgEl.src : '';
            lightboxImg.alt = caption;
            // Trigger the error if image is broken
            if (!imgEl || imgEl.naturalWidth === 0) {
                lightboxImg.style.display = 'none';
                lightboxFallback.classList.add('visible');
            }
        }

        lightboxCaption.textContent = caption;
        lightboxCat.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
    }

    // Open on item click
    allItems.forEach(function (item, i) {
        item.addEventListener('click', function () {
            visibleItems = getVisibleItems();
            const vIdx = visibleItems.indexOf(item);
            if (vIdx !== -1) openLightbox(vIdx);
        });
    });

    // Navigation
    lightboxNext.addEventListener('click', function () { showLightboxItem(currentIndex + 1); });
    lightboxPrev.addEventListener('click', function () { showLightboxItem(currentIndex - 1); });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'ArrowRight') showLightboxItem(currentIndex + 1);
        if (e.key === 'ArrowLeft') showLightboxItem(currentIndex - 1);
        if (e.key === 'Escape') closeLightbox();
    });

    // Touch/swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showLightboxItem(currentIndex + 1);
            else showLightboxItem(currentIndex - 1);
        }
    }, { passive: true });


    /* --------------------------------------------------------
       URL PARAM FILTER
       e.g. gallery.html?filter=sports auto-applies the filter
    -------------------------------------------------------- */
    const urlParams = new URLSearchParams(window.location.search);
    const paramFilter = urlParams.get('filter');
    if (paramFilter) {
        const matchBtn = document.querySelector('[data-filter="' + paramFilter + '"]');
        if (matchBtn) {
            matchBtn.click();
        }
    }


    /* --------------------------------------------------------
       SCROLL REVEAL
    -------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        allItems.forEach(function (el) {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }


    /* --------------------------------------------------------
       INITIAL COUNT
    -------------------------------------------------------- */
    if (visibleCount) visibleCount.textContent = allItems.length;

});