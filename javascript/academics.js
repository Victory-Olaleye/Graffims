document.addEventListener('DOMContentLoaded', function () {

    /* ---- PROGRAMME TABS (Primary / JSS / SSS) ---- */
    const progTabs = document.querySelectorAll('.prog-tab');
    const progPanels = document.querySelectorAll('.prog-panel');

    progTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const target = tab.getAttribute('data-target');

            // Update tab active state
            progTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            // Show matching panel
            progPanels.forEach(function (panel) {
                panel.classList.remove('active');
                if (panel.id === 'prog-' + target) {
                    panel.classList.add('active');
                }
            });
        });
    });


    /* ---- SENIOR SECONDARY TRACK TABS (Sciences / Arts / Commercials) ---- */
    const trackBtns = document.querySelectorAll('.track-btn');
    const trackPanels = document.querySelectorAll('.track-panel');

    trackBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const track = btn.getAttribute('data-track');

            trackBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            trackPanels.forEach(function (panel) {
                panel.classList.remove('active');
                if (panel.id === 'track-' + track) {
                    panel.classList.add('active');
                }
            });
        });
    });


    /* ---- FACILITY IMAGE FALLBACK ---- */
    document.querySelectorAll('.facility-img').forEach(function (img) {
        img.addEventListener('error', function () {
            img.style.display = 'none';
            var fallback = img.nextElementSibling;
            if (fallback && fallback.classList.contains('facility-img-fallback')) {
                fallback.style.opacity = '1';
            }
        });
    });


    /* ---- SCROLL REVEAL (academics-specific elements) ---- */
    const revealEls = document.querySelectorAll(
        '.astat, .prog-tab, .facility-card, .extra-category, .term-card, .subject-card'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.10 });

        revealEls.forEach(function (el) {
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }


    /* ---- DEEP LINK: open correct tab from URL hash ---- */
    // Allows links like academics.html#junior to auto-open the JSS tab
    const hash = window.location.hash;
    if (hash === '#preschool') {
        openProgTab('preschool');
    } else if (hash === '#junior' || hash === '#jss') {
        openProgTab('junior');
    } else if (hash === '#senior' || hash === '#sss') {
        openProgTab('senior');
    }

    function openProgTab(target) {
        progTabs.forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-target') === target);
        });
        progPanels.forEach(function (panel) {
            panel.classList.toggle('active', panel.id === 'prog-' + target);
        });
    }

});
