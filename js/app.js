/**
 * app.js — Allure Beauty Salon
 * Vanilla JS only. No external libraries.
 *
 * Covers:
 *  - Nav scroll behavior (transparent → solid)
 *  - Mobile hamburger menu toggle
 *  - FAQ accordion (keyboard accessible, aria-expanded)
 *  - Multi-step application form (stepper, validation, submit)
 *  - Specialty checkbox group validation
 *  - Step progress scroll
 *  - Character counter for booth-rental-goals textarea
 *  - Phone number auto-formatter
 *  - Honeypot anti-spam
 *  - Contact form submit (with success state)
 *  - Parallax (desktop ≥ 1024px + no reduced-motion only)
 */

'use strict';

/* ============================================================
   CONSTANTS
   ============================================================ */

const FORM_SUBMIT_ENDPOINT = 'REPLACE_ME'; // TODO: replace with your form endpoint (e.g. Formspree URL)

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Returns true if the user prefers reduced motion.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns true if viewport is desktop width (≥ 1024px).
 */
function isDesktop() {
  return window.innerWidth >= 1024;
}

/**
 * Show an error message for a field.
 * @param {HTMLElement} field
 * @param {string} message
 */
function showFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');

  // aria-describedby may contain multiple space-separated IDs (e.g. "helper-id error-id").
  // Find the one that references a .field-error element.
  const describedByAttr = field.getAttribute('aria-describedby') || '';
  const describedByIds = describedByAttr.split(/\s+/).filter(Boolean);
  let errorEl = null;
  for (const id of describedByIds) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('field-error')) {
      errorEl = el;
      break;
    }
  }

  if (!errorEl) {
    // No pre-existing error element found — create one and append the ID
    errorEl = document.createElement('p');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'polite');
    const newId = field.id + '-error';
    errorEl.id = newId;
    const updatedDescribedBy = describedByAttr ? (describedByAttr + ' ' + newId) : newId;
    field.setAttribute('aria-describedby', updatedDescribedBy);
    field.parentNode.appendChild(errorEl);
  }

  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

/**
 * Clear error state from a field.
 * @param {HTMLElement} field
 */
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const describedByAttr = field.getAttribute('aria-describedby') || '';
  const describedByIds = describedByAttr.split(/\s+/).filter(Boolean);
  for (const id of describedByIds) {
    const errorEl = document.getElementById(id);
    if (errorEl && errorEl.classList.contains('field-error')) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }
}

/**
 * Validate email format.
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validate phone — at least 10 digits.
 * @param {string} value
 * @returns {boolean}
 */
function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10;
}

/* ============================================================
   NAV — SCROLL BEHAVIOR
   ============================================================ */

function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 80;

  function updateNav() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.setAttribute('data-scrolled', '');
    } else {
      nav.removeAttribute('data-scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load in case page is already scrolled
}

/* ============================================================
   NAV — HAMBURGER MENU
   ============================================================ */

function initHamburger() {
  const hamburger = document.querySelector('.site-nav__hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-overlay__close');

  if (!hamburger || !overlay) return;

  function openMenu() {
    overlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking overlay background (not the menu items)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  // Close when a nav link inside overlay is clicked
  overlay.querySelectorAll('.nav-overlay__link, .btn-primary').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  let openItem = null;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const answer = item.querySelector('.faq-item__answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close previously open item (accordion behavior — one at a time)
      if (openItem && openItem !== item) {
        const prevTrigger = openItem.querySelector('.faq-item__trigger');
        const prevAnswer = openItem.querySelector('.faq-item__answer');
        if (prevTrigger && prevAnswer) {
          prevTrigger.setAttribute('aria-expanded', 'false');
          prevAnswer.hidden = true;
          openItem.classList.remove('faq-item--open');
        }
      }

      if (isOpen) {
        // Close this item
        trigger.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
        item.classList.remove('faq-item--open');
        openItem = null;
      } else {
        // Open this item
        trigger.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        item.classList.add('faq-item--open');
        openItem = item;
      }
    });
  });
}

/* ============================================================
   PARALLAX (desktop + no reduced motion only)
   ============================================================ */

function initParallax() {
  if (!isDesktop() || prefersReducedMotion()) return;

  const herosBgs = document.querySelectorAll('.hero__bg');
  if (!herosBgs.length) return;

  // For each hero, apply a JS parallax via background-position
  // This is only active when CSS background-attachment: fixed isn't applied
  // On modern browsers, background-attachment: fixed is handled in CSS already
  // This JS layer provides additional fine-grained control if needed

  function onScroll() {
    if (!isDesktop() || prefersReducedMotion()) return;

    herosBgs.forEach((bg) => {
      const hero = bg.closest('.hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const scrolled = window.scrollY;
      const offset = scrolled * 0.4;
      bg.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   MULTI-STEP APPLICATION FORM
   ============================================================ */

function initApplicationForm() {
  const formWrapper = document.querySelector('.application-form-wrapper');
  if (!formWrapper) return;

  const panels = formWrapper.querySelectorAll('.form-panel');
  const stepItems = formWrapper.querySelectorAll('.stepper__step');
  const compactLabel = formWrapper.querySelector('.stepper-compact');
  const successState = document.querySelector('.form-success');
  const errorBanner = formWrapper.querySelector('.form-error-banner');

  if (!panels.length) return;

  const TOTAL_STEPS = panels.length;
  let currentStep = 0; // 0-indexed

  const stepLabels = ['Your Background', 'Your Business', 'Your Story'];

  /**
   * Show a given step panel and update stepper UI.
   * @param {number} stepIndex — 0-indexed
   */
  function goToStep(stepIndex) {
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === stepIndex);
    });

    stepItems.forEach((item, i) => {
      item.classList.remove('stepper__step--active', 'stepper__step--completed', 'stepper__step--remaining');
      item.removeAttribute('aria-current');

      if (i < stepIndex) {
        item.classList.add('stepper__step--completed');
      } else if (i === stepIndex) {
        item.classList.add('stepper__step--active');
        item.setAttribute('aria-current', 'step');
      } else {
        item.classList.add('stepper__step--remaining');
      }
    });

    if (compactLabel) {
      compactLabel.innerHTML = `Step <strong>${stepIndex + 1}</strong> of ${TOTAL_STEPS} — <strong>${stepLabels[stepIndex] || ''}</strong>`;
    }

    // Scroll to top of form smoothly (unless user prefers reduced motion)
    const formTop = formWrapper.getBoundingClientRect().top + window.scrollY - 100;
    if (!prefersReducedMotion()) {
      window.scrollTo({ top: formTop, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: formTop });
    }

    currentStep = stepIndex;
  }

  /**
   * Validate all required fields in a given panel.
   * Returns an array of {field, message} objects. Empty array = valid.
   * @param {HTMLElement} panel
   * @returns {Array}
   */
  function validatePanel(panel) {
    const errors = [];

    // Clear all existing errors in this panel first
    panel.querySelectorAll('[aria-invalid]').forEach((f) => clearFieldError(f));

    // Text / email / tel / url inputs
    panel.querySelectorAll('input[required], select[required], textarea[required]').forEach((field) => {
      const type = field.type;
      const value = field.value.trim();

      if (!value) {
        errors.push({ field, message: 'This field is required.' });
        return;
      }

      if (type === 'email' && !isValidEmail(value)) {
        errors.push({ field, message: 'Please enter a valid email address (e.g., name@example.com)' });
        return;
      }

      if (type === 'tel' && value && !isValidPhone(value)) {
        errors.push({ field, message: 'Please enter a 10-digit phone number.' });
        return;
      }

      if (field.tagName === 'TEXTAREA' && field.minLength > 0 && value.length < field.minLength) {
        if (field.id === 'why_booth_rental') {
          errors.push({ field, message: 'Please write at least 50 characters about your booth rental goals.' });
        } else {
          errors.push({ field, message: `Please enter at least ${field.minLength} characters.` });
        }
        return;
      }

      if (type === 'checkbox' && !field.checked) {
        errors.push({ field, message: 'You must check this box to continue.' });
        return;
      }
    });

    // Required radio groups (fieldsets with required inputs)
    panel.querySelectorAll('fieldset[data-required]').forEach((fieldset) => {
      const radios = fieldset.querySelectorAll('input[type="radio"]');
      const anyChecked = Array.from(radios).some((r) => r.checked);
      if (!anyChecked) {
        const firstRadio = radios[0];
        if (firstRadio) {
          errors.push({ field: firstRadio, message: 'Please select an option.' });
        }
      }
    });

    // Required checkbox groups (fieldsets with data-required-checkboxes)
    panel.querySelectorAll('fieldset[data-required-checkboxes]').forEach((fieldset) => {
      const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]');
      const anyChecked = Array.from(checkboxes).some((c) => c.checked);
      if (!anyChecked) {
        const errorEl = fieldset.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = 'Please select at least one specialty.';
          errorEl.style.display = 'block';
        }
        const firstCheckbox = checkboxes[0];
        if (firstCheckbox) {
          errors.push({ field: firstCheckbox, message: 'Please select at least one specialty.' });
        }
      } else {
        const errorEl = fieldset.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
      }
    });

    return errors;
  }

  /**
   * Display validation errors in the panel.
   * @param {Array} errors — [{field, message}]
   */
  function displayErrors(errors) {
    errors.forEach(({ field, message }) => {
      showFieldError(field, message);
    });

    if (errors.length > 0) {
      errors[0].field.focus();
    }
  }

  /**
   * Wire up Next / Back / Submit buttons.
   */
  panels.forEach((panel, i) => {
    const nextBtn = panel.querySelector('[data-action="next"]');
    const backBtn = panel.querySelector('[data-action="back"]');
    const submitBtn = panel.querySelector('[data-action="submit"]');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const errors = validatePanel(panel);
        if (errors.length > 0) {
          displayErrors(errors);
          return;
        }
        goToStep(i + 1);
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        goToStep(i - 1);
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmit(panel, submitBtn);
      });
    }

    // Live validation on blur — clear error when field is corrected
    panel.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => {
        const value = field.value.trim();
        const type = field.type;

        if (!field.required) {
          clearFieldError(field);
          return;
        }

        if (!value && field.type !== 'checkbox') {
          showFieldError(field, 'This field is required.');
        } else if (type === 'email' && !isValidEmail(value)) {
          showFieldError(field, 'Please enter a valid email address (e.g., name@example.com)');
        } else if (type === 'tel' && value && !isValidPhone(value)) {
          showFieldError(field, 'Please enter a 10-digit phone number.');
        } else if (field.tagName === 'TEXTAREA' && field.minLength > 0 && value.length < field.minLength) {
          if (field.id === 'why_booth_rental') {
            showFieldError(field, 'Please write at least 50 characters about your booth rental goals.');
          } else {
            showFieldError(field, `Please enter at least ${field.minLength} characters.`);
          }
        } else if (type === 'checkbox' && !field.checked) {
          showFieldError(field, 'You must check this box to continue.');
        } else {
          clearFieldError(field);
        }
      });

      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          clearFieldError(field);
        }
      });
    });
  });

  /**
   * Handle final form submission.
   * @param {HTMLElement} panel
   * @param {HTMLElement} submitBtn
   */
  async function handleFormSubmit(panel, submitBtn) {
    const errors = validatePanel(panel);
    if (errors.length > 0) {
      displayErrors(errors);
      return;
    }

    // Honeypot check
    const honeypot = formWrapper.querySelector('.honeypot-input');
    if (honeypot && honeypot.value) {
      // Bot detected — silently fail
      showSuccessState('there');
      return;
    }

    // Gather form data
    const form = formWrapper.querySelector('form');
    if (!form) return;

    const formData = new FormData(form);

    // Get first name for personalized success message
    const firstName = (formData.get('first_name') || formData.get('full_name') || '').split(' ')[0] || 'there';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    if (errorBanner) {
      errorBanner.classList.remove('is-visible');
    }

    if (FORM_SUBMIT_ENDPOINT === 'REPLACE_ME') {
      // Development mode — simulate success
      await new Promise((r) => setTimeout(r, 800));
      showSuccessState(firstName);
      return;
    }

    try {
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        showSuccessState(firstName);
      } else {
        throw new Error('Server error: ' + response.status);
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit My Application';
      if (errorBanner) {
        errorBanner.textContent = "Something went wrong on our end — we're sorry about that. Please try submitting again, or email us directly and we'll get your application sorted.";
        errorBanner.classList.add('is-visible');
      }
      console.error('Form submission error:', err);
    }
  }

  /**
   * Show the success state, replacing the form.
   * @param {string} firstName
   */
  function showSuccessState(firstName) {
    if (formWrapper) {
      formWrapper.style.display = 'none';
    }

    if (successState) {
      // Update body text with first name
      const bodyEl = successState.querySelector('.form-success__body');
      if (bodyEl) {
        bodyEl.innerHTML = `Thank you, <strong>${escapeHtml(firstName)}</strong>. We'll review your application and reach out within 24 hours to discuss availability and schedule a tour.`;
      }

      successState.classList.add('is-visible');
      successState.setAttribute('role', 'status');
      successState.focus();
    }
  }

  // Initialize on step 0
  goToStep(0);
}

/* ============================================================
   PHONE NUMBER AUTO-FORMATTER
   ============================================================ */

function initPhoneFormatter() {
  // Apply to all tel inputs on the page
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      const digits = input.value.replace(/\D/g, '').slice(0, 10);
      let formatted = '';
      if (digits.length === 0) {
        formatted = '';
      } else if (digits.length <= 3) {
        formatted = '(' + digits;
      } else if (digits.length <= 6) {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
      } else {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
      }
      input.value = formatted;
    });
  });
}

/* ============================================================
   CHARACTER COUNTER — Booth Rental Goals Textarea
   ============================================================ */

function initCharCounter() {
  const textarea = document.getElementById('why_booth_rental');
  const counter = document.getElementById('why-counter');
  if (!textarea || !counter) return;

  const MIN_CHARS = 50;

  function updateCounter() {
    const len = textarea.value.length;
    if (len >= MIN_CHARS) {
      counter.textContent = len + ' characters — looks good!';
      counter.style.color = 'var(--color-success, #2d7a4f)';
      counter.classList.add('counter--met');
    } else {
      counter.textContent = len + ' / ' + MIN_CHARS + ' minimum';
      counter.style.color = 'var(--color-text-secondary, #888)';
      counter.classList.remove('counter--met');
    }
  }

  textarea.addEventListener('input', updateCounter);
  updateCounter(); // run once on load
}

/* ============================================================
   CONTACT FORM
   ============================================================ */

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const successEl = document.querySelector('.contact-success');
  const errorBanner = form.querySelector('.form-error-banner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate fields
    const errors = [];
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach((field) => {
      clearFieldError(field);
      const value = field.value.trim();
      const type = field.type;

      if (!value) {
        errors.push({ field, message: 'This field is required.' });
      } else if (type === 'email' && !isValidEmail(value)) {
        errors.push({ field, message: 'Please enter a valid email address (e.g., name@example.com)' });
      } else if (type === 'tel' && value && !isValidPhone(value)) {
        errors.push({ field, message: 'Please enter a 10-digit phone number.' });
      }
    });

    // Textarea minlength
    const textarea = form.querySelector('textarea[minlength]');
    if (textarea && textarea.value.trim().length < parseInt(textarea.minLength, 10)) {
      if (!errors.find((e) => e.field === textarea)) {
        errors.push({ field: textarea, message: `Please enter at least ${textarea.minLength} characters.` });
      }
    }

    if (errors.length > 0) {
      errors.forEach(({ field, message }) => showFieldError(field, message));
      errors[0].field.focus();
      return;
    }

    // Honeypot check
    const honeypot = form.querySelector('.honeypot-input');
    if (honeypot && honeypot.value) {
      if (successEl) successEl.classList.add('is-visible');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (errorBanner) errorBanner.classList.remove('is-visible');

    if (FORM_SUBMIT_ENDPOINT === 'REPLACE_ME') {
      await new Promise((r) => setTimeout(r, 700));
      form.style.display = 'none';
      if (successEl) successEl.classList.add('is-visible');
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('is-visible');
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      if (errorBanner) {
        errorBanner.textContent = "Something went wrong. Please try again or email us directly.";
        errorBanner.classList.add('is-visible');
      }
    }
  });

  // Live blur validation
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const value = field.value.trim();
      const type = field.type;

      if (!field.required) { clearFieldError(field); return; }

      if (!value) {
        showFieldError(field, 'This field is required.');
      } else if (type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address (e.g., name@example.com)');
      } else if (type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a 10-digit phone number.');
      } else {
        clearFieldError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') clearFieldError(field);
    });
  });
}

/* ============================================================
   CLIENT INQUIRY MODAL
   ============================================================ */

function initInquiryModal() {
  const modal    = document.getElementById('inquiry-modal');
  if (!modal) return;

  const closeBtn  = document.getElementById('inquiry-modal-close');
  const form      = document.getElementById('inquiry-form');
  const errorEl   = document.getElementById('inquiry-error');
  const successEl = document.getElementById('inquiry-success');
  const submitBtn = document.getElementById('inquiry-submit');

  const triggers = Array.from(document.querySelectorAll('.js-inquiry-trigger'));

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  triggers.forEach(function(t) {
    t.addEventListener('click', function(e) { e.preventDefault(); openModal(); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name    = document.getElementById('inq-name').value.trim();
    const contact = document.getElementById('inq-contact').value.trim();

    if (!name || !contact) {
      errorEl.textContent = 'Please enter your name and a phone number or email.';
      errorEl.classList.add('is-visible');
      return;
    }

    errorEl.classList.remove('is-visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      var res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    name,
          contact: contact,
          service: document.getElementById('inq-service').value,
          message: document.getElementById('inq-message').value.trim(),
        }),
      });

      if (res.ok) {
        form.hidden = true;
        successEl.hidden = false;
      } else {
        throw new Error('server');
      }
    } catch (_) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
      errorEl.textContent = 'Something went wrong — please call or email us directly.';
      errorEl.classList.add('is-visible');
    }
  });
}

/* ============================================================
   PHOTO CAROUSEL
   ============================================================ */

function initPhotoCarousel() {
  const carousel = document.getElementById('photo-carousel');
  if (!carousel) return;

  const track   = document.getElementById('carousel-track');
  const slides  = track ? track.querySelectorAll('.photo-carousel__slide') : [];
  const dots    = carousel.querySelectorAll('.photo-carousel__dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || !slides.length) return;

  const total = slides.length;
  let current  = 0;
  let autoTimer = null;
  const INTERVAL = 4500;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    slides.forEach(function(slide, i) {
      slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dots.forEach(function(dot, i) {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function() { goTo(current + 1); }, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() { goTo(current - 1); startAuto(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() { goTo(current + 1); startAuto(); });
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(dot.dataset.slide, 10));
      startAuto();
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch swipe
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
      startAuto();
    }
  }, { passive: true });

  // Keyboard navigation when carousel is focused
  carousel.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // Init (no auto-advance for reduced-motion users)
  goTo(0);
  if (!prefersReducedMotion()) {
    startAuto();
  }
}

/* ============================================================
   UTILITY — HTML ESCAPE
   ============================================================ */

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */

function initScrollReveal() {
  if (prefersReducedMotion()) return;

  const reveals = document.querySelectorAll('.reveal, .reveal--left, .reveal--scale');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '-40px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================================
   INIT — RUN ON DOM READY
   ============================================================ */

function init() {
  initNavScroll();
  initHamburger();
  initFaqAccordion();
  initApplicationForm();
  initPhoneFormatter();
  initCharCounter();
  initContactForm();
  initParallax();
  initPhotoCarousel();
  initInquiryModal();
  initScrollReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
