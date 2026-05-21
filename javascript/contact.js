document.addEventListener('DOMContentLoaded', function () {


    /* ---- SUBJECT TABS ---- */
    const subjectTabs = document.querySelectorAll('.subject-tab');
    const subjectField = document.getElementById('subjectField');

    subjectTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            subjectTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            if (subjectField) subjectField.value = tab.getAttribute('data-subject');
        });
    });


    /* ---- CHARACTER COUNTER ---- */
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const MAX_CHARS = 600;

    if (messageField && charCount) {
        messageField.addEventListener('input', function () {
            const len = messageField.value.length;
            charCount.textContent = len;
            const wrap = charCount.closest('.char-count');
            if (len > MAX_CHARS) {
                wrap.classList.add('over-limit');
            } else {
                wrap.classList.remove('over-limit');
            }
        });
    }


    /* ---- CONTACT FORM VALIDATION & SUBMISSION ---- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateContactForm()) {
                handleContactSubmit();
            }
        });
    }

    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function () {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.reset();
            // Reset subject tab to General
            subjectTabs.forEach(function (t) { t.classList.remove('active'); });
            if (subjectTabs[0]) subjectTabs[0].classList.add('active');
            if (subjectField) subjectField.value = 'General Inquiry';
            if (charCount) charCount.textContent = '0';
        });
    }

    function validateContactForm() {
        let valid = true;

        // Clear previous errors
        document.querySelectorAll('.field-error').forEach(function (el) {
            el.textContent = '';
            el.classList.remove('visible');
        });
        document.querySelectorAll('.error').forEach(function (el) {
            el.classList.remove('error');
        });

        const required = [
            { id: 'firstName', msg: 'Please enter your first name.' },
            { id: 'lastName', msg: 'Please enter your last name.' },
            { id: 'email', msg: 'Please enter your email address.' },
            { id: 'message', msg: 'Please enter a message.' }
        ];

        required.forEach(function (field) {
            const input = document.getElementById(field.id);
            const err = document.getElementById('err-' + field.id);
            if (!input || !input.value.trim()) {
                if (input) input.classList.add('error');
                if (err) { err.textContent = field.msg; err.classList.add('visible'); }
                valid = false;
            }
        });

        // Email format
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim()) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(emailInput.value.trim())) {
                emailInput.classList.add('error');
                const errEl = document.getElementById('err-email');
                if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.classList.add('visible'); }
                valid = false;
            }
        }

        // Message length
        if (messageField && messageField.value.length > MAX_CHARS) {
            messageField.classList.add('error');
            const errEl = document.getElementById('err-message');
            if (errEl) { errEl.textContent = 'Message must be under 600 characters.'; errEl.classList.add('visible'); }
            valid = false;
        }

        // Consent
        const consent = document.getElementById('consent');
        const consentErr = document.getElementById('err-consent');
        if (consent && !consent.checked) {
            if (consentErr) { consentErr.textContent = 'Please agree to continue.'; consentErr.classList.add('visible'); }
            valid = false;
        }

        return valid;
    }

    function handleContactSubmit() {
        // Loading state
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'Sending…';
        if (submitIcon) submitIcon.style.display = 'none';

        // Simulate send — replace with real fetch() / Formspree / Netlify Forms when live
        setTimeout(function () {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Reset button state for future sends
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = 'Send Message';
            if (submitIcon) submitIcon.style.display = 'inline';
        }, 1200);
    }

    // Clear errors on input
    document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(function (el) {
        el.addEventListener('input', function () {
            el.classList.remove('error');
            const errEl = document.getElementById('err-' + el.id);
            if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
        });
    });


    /* ---- GOOGLE MAP FALLBACK ---- */
    // If the iframe fails to load, show the fallback card
    const mapIframe = document.getElementById('googleMap');
    const mapFallback = document.getElementById('mapFallback');

    if (mapIframe && mapFallback) {
        mapIframe.addEventListener('error', function () {
            mapFallback.classList.add('visible');
        });

        // Some browsers don't fire error on iframes — use a load timeout fallback
        var mapTimer = setTimeout(function () {
            try {
                // If contentDocument is null it likely failed to load cross-origin (expected) but not blocked
                // We only show the fallback if the iframe src is clearly empty/broken
                if (!mapIframe.src || mapIframe.src === 'about:blank') {
                    mapFallback.classList.add('visible');
                }
            } catch (e) {
                // Cross-origin access blocked is expected for Google Maps — leave iframe visible
            }
        }, 8000);

        mapIframe.addEventListener('load', function () {
            clearTimeout(mapTimer);
        });
    }


    /* ---- SCROLL REVEAL ---- */
    const revealEls = document.querySelectorAll(
        '.qc-card, .cfaq-item, .dept-item, .social-link, .direction-item'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach(function (el) {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }


    /* ---- SMOOTH SCROLL for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // account for sticky nav
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

});