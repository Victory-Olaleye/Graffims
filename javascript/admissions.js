document.addEventListener('DOMContentLoaded', function () {


    /* ---- REQUIREMENTS LEVEL SWITCHER ---- */
    const levelBtns = document.querySelectorAll('.level-btn');
    const levelPanels = document.querySelectorAll('.level-panel');

    levelBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const level = btn.getAttribute('data-level');

            levelBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            levelPanels.forEach(function (panel) {
                panel.classList.remove('active');
                if (panel.id === 'level-' + level) panel.classList.add('active');
            });
        });
    });


    /* ---- FAQ ACCORDION ---- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            const isOpen = question.getAttribute('aria-expanded') === 'true';

            // Close all
            faqItems.forEach(function (i) {
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                i.querySelector('.faq-answer').classList.remove('open');
            });

            // Open this one (toggle)
            if (!isOpen) {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });


    /* ---- LIVE APPLICATION CHECKLIST ---- */
    const checkMap = {
        'childFirst': 'chk-name',
        'childLast': 'chk-name',
        'dob': 'chk-dob',
        'entryLevel': 'chk-level',
        'parentFirst': 'chk-parent',
        'parentLast': 'chk-parent',
        'parentEmail': 'chk-contact',
        'parentPhone': 'chk-contact'
    };

    // Track which groups are satisfied
    const groupSatisfied = {
        'chk-name': false,
        'chk-dob': false,
        'chk-level': false,
        'chk-parent': false,
        'chk-contact': false
    };

    // Group fields that need BOTH filled
    const groupFields = {
        'chk-name': ['childFirst', 'childLast'],
        'chk-parent': ['parentFirst', 'parentLast'],
        'chk-contact': ['parentEmail', 'parentPhone']
    };

    Object.keys(checkMap).forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener('input', function () {
            updateChecklist();
        });
        input.addEventListener('change', function () {
            updateChecklist();
        });
    });

    function updateChecklist() {
        // Single-field groups
        ['chk-dob', 'chk-level'].forEach(function (chkId) {
            const fieldId = Object.keys(checkMap).find(k => checkMap[k] === chkId);
            if (!fieldId) return;
            const input = document.getElementById(fieldId);
            groupSatisfied[chkId] = input && input.value.trim() !== '';
            setCheck(chkId, groupSatisfied[chkId]);
        });

        // Multi-field groups
        Object.keys(groupFields).forEach(function (chkId) {
            const ids = groupFields[chkId];
            const allFilled = ids.every(function (id) {
                const el = document.getElementById(id);
                return el && el.value.trim() !== '';
            });
            groupSatisfied[chkId] = allFilled;
            setCheck(chkId, allFilled);
        });
    }

    function setCheck(id, checked) {
        const box = document.getElementById(id);
        if (!box) return;
        if (checked) {
            box.classList.add('checked');
        } else {
            box.classList.remove('checked');
        }
    }


    /* ---- FORM VALIDATION & SUBMISSION ---- */
    const applyForm = document.getElementById('applyForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (applyForm) {
        applyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateForm()) {
                handleSubmit();
            }
        });
    }

    function validateForm() {
        let valid = true;

        const required = [
            { id: 'childFirst', msg: 'Please enter the child\'s first name.' },
            { id: 'childLast', msg: 'Please enter the child\'s last name.' },
            { id: 'dob', msg: 'Please enter the child\'s date of birth.' },
            { id: 'gender', msg: 'Please select a gender.' },
            { id: 'entryLevel', msg: 'Please select an entry level.' },
            { id: 'parentFirst', msg: 'Please enter the parent/guardian\'s first name.' },
            { id: 'parentLast', msg: 'Please enter the parent/guardian\'s last name.' },
            { id: 'parentEmail', msg: 'Please enter a valid email address.' },
            { id: 'parentPhone', msg: 'Please enter a phone number.' }
        ];

        // Clear all errors
        document.querySelectorAll('.field-error').forEach(function (el) {
            el.textContent = '';
            el.classList.remove('visible');
        });
        document.querySelectorAll('.error').forEach(function (el) {
            el.classList.remove('error');
        });

        required.forEach(function (field) {
            const input = document.getElementById(field.id);
            const err = document.getElementById('err-' + field.id);
            if (!input) return;

            if (!input.value.trim()) {
                showError(input, err, field.msg);
                valid = false;
            }

            // Email format check
            if (field.id === 'parentEmail' && input.value.trim()) {
                const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRe.test(input.value.trim())) {
                    showError(input, err, 'Please enter a valid email address.');
                    valid = false;
                }
            }
        });

        // Consent checkbox
        const consent = document.getElementById('consent');
        const consentErr = document.getElementById('err-consent');
        if (consent && !consent.checked) {
            if (consentErr) {
                consentErr.textContent = 'You must agree before submitting.';
                consentErr.classList.add('visible');
            }
            valid = false;
        }

        return valid;
    }

    function showError(input, errEl, msg) {
        input.classList.add('error');
        if (errEl) {
            errEl.textContent = msg;
            errEl.classList.add('visible');
        }
    }

    function handleSubmit() {
        // Collect form values
        const formData = new FormData(applyForm);
        const data = Object.fromEntries(formData.entries());
        data.consent = formData.get('consent') === 'on';

        // Log the collected data (replace this with real submission logic)
        console.log('Admissions form data:', data);

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';

        // Simulate a short delay (replace with real fetch/AJAX when backend is ready)
        setTimeout(function () {
            applyForm.style.display = 'none';
            formSuccess.style.display = 'block';
            // Scroll success message into view
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1200);
    }


    /* ---- SCROLL REVEAL ---- */
    const revealEls = document.querySelectorAll(
        '.process-step, .req-card, .fee-card, .faq-item, .why-apply-item'
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
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }


    /* ---- CLEAR FIELD ERRORS ON INPUT ---- */
    document.querySelectorAll('.apply-form input, .apply-form select, .apply-form textarea').forEach(function (input) {
        input.addEventListener('input', function () {
            input.classList.remove('error');
            const errId = 'err-' + input.id;
            const err = document.getElementById(errId);
            if (err) { err.textContent = ''; err.classList.remove('visible'); }
        });
    });

});