/**
 * MEO Care Organization - Official Frontend Scripts
 * Technologies: Vanilla JS, jQuery 3.7+, Bootstrap 5
 * Pure frontend interaction, accessible UX, zero data collection.
 */

$(document).ready(function () {
  'use strict';

  // 1. Dynamic Year Update in Footers
  const currentYear = new Date().getFullYear();
  $('.current-year-text').text(currentYear);

  // 2. Navbar Scroll Behavior
  const $navbar = $('.navbar-custom');
  const $scrollTopBtn = $('#btnScrollTop');

  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop();

    if (scrollPos > 40) {
      $navbar.addClass('navbar-scrolled');
    } else {
      $navbar.removeClass('navbar-scrolled');
    }

    if (scrollPos > 320) {
      $scrollTopBtn.addClass('show');
    } else {
      $scrollTopBtn.removeClass('show');
    }
  });

  // Scroll to Top action
  $scrollTopBtn.on('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Highlight Active Navigation Item Based on Location
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  $('.navbar-nav .nav-link, .dropdown-menu-custom .dropdown-item').each(function () {
    const href = $(this).attr('href');
    if (href && href !== '#' && (href === page || (page === '' && href === 'index.html') || href.startsWith(page))) {
      $(this).addClass('active');
      const $parentDropdown = $(this).closest('.dropdown').find('.nav-link.dropdown-toggle');
      if ($parentDropdown.length) {
        $parentDropdown.addClass('active');
      }
    }
  });

  // 4. Reliable Dropdown & Mobile Navigation Management (Bootstrap 5 API Integration)
  // Ensure Bootstrap 5 Dropdown instances are initialized with static display and autoClose
  if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    document.querySelectorAll('.navbar .dropdown-toggle').forEach(function (toggleEl) {
      bootstrap.Dropdown.getOrCreateInstance(toggleEl, {
        display: 'static',
        autoClose: true
      });
    });
  }

  // Keep parent .dropdown class, menu classes, and aria-expanded perfectly synchronized
  $('.navbar .dropdown').on('show.bs.dropdown', function () {
    $(this).addClass('show');
    $(this).find('.dropdown-menu-custom').addClass('show');
    $(this).find('.dropdown-toggle').attr('aria-expanded', 'true');
  });

  $('.navbar .dropdown').on('hide.bs.dropdown', function () {
    $(this).removeClass('show');
    $(this).find('.dropdown-menu-custom').removeClass('show');
    $(this).find('.dropdown-toggle').attr('aria-expanded', 'false');
  });

  // Close mobile navbar drawer when any regular nav link or dropdown item is clicked
  $(document).on('click', '.navbar-collapse .nav-link:not(.dropdown-toggle), .navbar-collapse .dropdown-item', function () {
    const $navbarCollapse = $('#navbarMain');
    if ($navbarCollapse.hasClass('show')) {
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          $navbarCollapse.collapse('hide');
        }
      } else {
        $navbarCollapse.collapse('hide');
      }
    }
  });

  // Accessible Keyboard Support for Dropdowns & Navigation (Escape to close)
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      let openToggle = null;
      document.querySelectorAll('.navbar .dropdown-toggle[aria-expanded="true"]').forEach(function (toggleEl) {
        openToggle = toggleEl;
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
          const bsDropdown = bootstrap.Dropdown.getInstance(toggleEl);
          if (bsDropdown) {
            bsDropdown.hide();
          }
        }
      });

      $('.navbar .dropdown').removeClass('show');
      $('.navbar .dropdown-menu-custom').removeClass('show');
      $('.navbar .dropdown-toggle').attr('aria-expanded', 'false');

      if (openToggle) {
        openToggle.focus();
      }

      // Close mobile drawer if open and return focus to menu toggler
      const $navbarCollapse = $('#navbarMain');
      if ($navbarCollapse.hasClass('show')) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
          const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);
          if (bsCollapse) {
            bsCollapse.hide();
          } else {
            $navbarCollapse.collapse('hide');
          }
        } else {
          $navbarCollapse.collapse('hide');
        }
        $('.custom-toggler').focus();
      }
    }
  });

  // 5. Tasteful Fade-in / Slide-in Scroll Animations (IntersectionObserver)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // If reduced-motion is requested or observer is unsupported, show immediately
    $('.fade-in-on-scroll').addClass('is-visible');
  }

  // 6. Toast Notification Helper
  function showFrontendToast(title, message, iconClass = 'bi-info-circle-fill text-forest') {
    let $toast = $('#frontendDemoToast');
    if (!$toast.length) {
      const toastHtml = `
        <div id="frontendDemoToast" class="toast toast-custom" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header border-bottom-0 pb-1">
            <i class="bi ${iconClass} me-2 fs-5"></i>
            <strong class="me-auto font-heading toast-title-text">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body pt-1 text-muted toast-body-text">
            ${message}
          </div>
        </div>`;
      $('body').append(toastHtml);
      $toast = $('#frontendDemoToast');
    } else {
      $toast.find('.toast-title-text').text(title);
      $toast.find('.toast-body-text').html(message);
    }

    const bsToast = new bootstrap.Toast($toast[0], { delay: 6500 });
    bsToast.show();
  }

  // ==========================================================================
  // 7. Complete Client-Side Form Validation System
  // ==========================================================================

  const FormValidator = {
    // 1. Required field check
    required(val) {
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') return val.trim().length > 0;
      return Boolean(val);
    },

    // 2. Name validation: letters, spaces, hyphens, apostrophes; min 2 chars; no numbers only
    validateName(val, fieldLabel = 'Name') {
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return { valid: false, message: `Please enter your ${fieldLabel.toLowerCase()}.` };
      }
      const trimmed = val.trim();
      if (trimmed.length < 2) {
        return { valid: false, message: `${fieldLabel} must be at least 2 characters.` };
      }
      if (trimmed.length > 70) {
        return { valid: false, message: `${fieldLabel} cannot exceed 70 characters.` };
      }
      if (/\d/.test(trimmed)) {
        return { valid: false, message: `${fieldLabel} cannot contain numbers.` };
      }
      const nameRegex = /^[a-zA-Z\u00C0-\u024F\u0600-\u06FF\s.'’-]+$/;
      if (!nameRegex.test(trimmed)) {
        return { valid: false, message: `Please enter a valid ${fieldLabel.toLowerCase()} using letters only.` };
      }
      return { valid: true };
    },

    // 3. Email validation
    validateEmail(val, required = true) {
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return required ? { valid: false, message: 'Please enter your email address.' } : { valid: true };
      }
      const trimmed = val.trim();
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid email address (e.g., name@example.com).' };
      }
      return { valid: true };
    },

    // 4. Phone validation (including Pakistani numbers +92 or 03)
    validatePhone(val, required = false) {
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return required ? { valid: false, message: 'Please enter your phone number.' } : { valid: true };
      }
      const trimmed = val.trim();
      if (/[a-zA-Z]/.test(trimmed)) {
        return { valid: false, message: 'Phone number cannot contain letters.' };
      }
      const clean = trimmed.replace(/[\s\-()]/g, '');

      // Check Pakistani formats:
      // 03XX XXXXXXX -> 11 digits
      if (clean.startsWith('03')) {
        if (clean.length !== 11 || !/^\d{11}$/.test(clean)) {
          return { valid: false, message: 'Pakistani mobile numbers must be 11 digits (e.g., 0300 1234567).' };
        }
        return { valid: true };
      }
      // +923XX XXXXXXX or 923XX XXXXXXX
      if (clean.startsWith('+923') || clean.startsWith('923')) {
        const digits = clean.replace(/^\+/, '');
        if (digits.length !== 12 || !/^\d{12}$/.test(digits)) {
          return { valid: false, message: 'Pakistani numbers with country code must be 12 digits (e.g., +92 300 1234567).' };
        }
        return { valid: true };
      }

      // General international phone validation: 7 to 15 digits
      const digitsOnly = clean.replace(/^\+/, '');
      if (!/^\d+$/.test(digitsOnly)) {
        return { valid: false, message: 'Please enter a valid phone number.' };
      }
      if (digitsOnly.length < 7) {
        return { valid: false, message: 'Phone number is too short (minimum 7 digits).' };
      }
      if (digitsOnly.length > 15) {
        return { valid: false, message: 'Phone number is too long (maximum 15 digits).' };
      }
      return { valid: true };
    },

    // 5. Password validation
    validatePassword(val, minLength = 8, required = true) {
      if (!val || typeof val !== 'string' || val.length === 0) {
        return required ? { valid: false, message: 'Please enter a password.' } : { valid: true };
      }
      if (val.length < minLength) {
        return { valid: false, message: `Password must be at least ${minLength} characters.` };
      }
      return { valid: true };
    },

    // 6. Confirm Password validation
    validateConfirmPassword(confirmVal, passwordVal) {
      if (!confirmVal) {
        return { valid: false, message: 'Please confirm your password.' };
      }
      if (confirmVal !== passwordVal) {
        return { valid: false, message: 'Passwords do not match.' };
      }
      return { valid: true };
    },

    // 7. Message validation (reasonable min/max length)
    validateMessage(val, minLength = 10, maxLength = 2000, required = true) {
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return required ? { valid: false, message: 'Please enter your message.' } : { valid: true };
      }
      const trimmed = val.trim();
      if (trimmed.length < minLength) {
        return { valid: false, message: `Please provide more detail (at least ${minLength} characters).` };
      }
      if (trimmed.length > maxLength) {
        return { valid: false, message: `Message cannot exceed ${maxLength} characters.` };
      }
      return { valid: true };
    },

    // 8. Donation Amount validation (positive number > 0)
    validateDonationAmount(val) {
      if (val === null || val === undefined || String(val).trim() === '') {
        return { valid: false, message: 'Please enter a donation amount.' };
      }
      const num = Number(val);
      if (isNaN(num)) {
        return { valid: false, message: 'Donation amount must be a valid number.' };
      }
      if (num <= 0) {
        return { valid: false, message: 'Donation amount must be greater than zero ($1 minimum).' };
      }
      if (num < 1) {
        return { valid: false, message: 'Minimum donation amount is $1.' };
      }
      if (num > 1000000) {
        return { valid: false, message: 'Maximum online donation is $1,000,000. For larger gifts, please contact us.' };
      }
      return { valid: true };
    },

    // 9. Dropdown select validation
    validateSelect(val, fieldLabel = 'an option') {
      if (!val || String(val).trim() === '') {
        return { valid: false, message: `Please select ${fieldLabel}.` };
      }
      return { valid: true };
    },

    // 10. General text field validation (location, subject, etc.)
    validateText(val, fieldLabel = 'This field', minLength = 2, maxLength = 120, required = true) {
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return required ? { valid: false, message: `Please enter ${fieldLabel.toLowerCase()}.` } : { valid: true };
      }
      const trimmed = val.trim();
      if (trimmed.length < minLength) {
        return { valid: false, message: `${fieldLabel} must be at least ${minLength} characters.` };
      }
      if (trimmed.length > maxLength) {
        return { valid: false, message: `${fieldLabel} cannot exceed ${maxLength} characters.` };
      }
      return { valid: true };
    }
  };

  // Helper: Display field-level inline error
  function showFieldError($field, message) {
    let fieldId = $field.attr('id');
    if (!fieldId) {
      fieldId = 'field_' + Math.random().toString(36).substring(2, 9);
      $field.attr('id', fieldId);
    }
    const errorId = fieldId + '-error';

    $field.removeClass('is-valid').addClass('is-invalid');
    $field.attr('aria-invalid', 'true').attr('aria-describedby', errorId);

    // If input is inside an input-group, append the error message after the input-group wrapper
    const $targetContainer = $field.closest('.input-group').length ? $field.closest('.input-group') : $field;

    let $error = $('#' + errorId);
    if (!$error.length) {
      $error = $(`
        <div class="field-error-msg" id="${errorId}" role="alert">
          <i class="bi bi-exclamation-circle-fill"></i>
          <span>${escapeHtml(message)}</span>
        </div>
      `);
      $targetContainer.after($error);
    } else {
      $error.find('span').text(message);
      $error.show();
    }
  }

  // Helper: Clear field-level inline error
  function clearFieldError($field, markValid = true) {
    const fieldId = $field.attr('id');
    $field.removeClass('is-invalid');
    $field.removeAttr('aria-invalid');

    if (fieldId) {
      $('#' + fieldId + '-error').remove();
      $field.removeAttr('aria-describedby');
    }

    if (markValid) {
      $field.addClass('is-valid');
    } else {
      $field.removeClass('is-valid');
    }
  }

  // Helper: Render top-of-form banner alert
  function showFormAlert($form, type, title, message) {
    const alertId = 'formAlert_' + ($form.attr('id') || 'active');
    $('#' + alertId).remove();

    const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger';
    const alertHtml = `
      <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show form-submission-alert d-flex align-items-center" role="alert">
        <i class="bi ${icon} fs-4 me-3 flex-shrink-0"></i>
        <div>
          <strong>${escapeHtml(title)}</strong> ${message}
        </div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    $form.prepend(alertHtml);

    const alertEl = document.getElementById(alertId);
    if (alertEl) {
      alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // --------------------------------------------------------------------------
  // Contact Form Validation & Handler (#contactDemoForm)
  // --------------------------------------------------------------------------
  const $contactForm = $('#contactDemoForm');
  if ($contactForm.length) {
    const $name = $('#contactFullName');
    const $email = $('#contactEmail');
    const $phone = $('#contactPhone');
    const $topic = $('#contactTopic');
    const $subject = $('#contactSubject');
    const $message = $('#contactMessage');

    // Real-time clearance listeners
    $name.on('input', function () {
      const res = FormValidator.validateName($(this).val(), 'Full Name');
      if (res.valid) clearFieldError($(this), true);
    });

    $email.on('input', function () {
      const res = FormValidator.validateEmail($(this).val(), true);
      if (res.valid) clearFieldError($(this), true);
    });

    $phone.on('input', function () {
      const val = $(this).val();
      if (!val || val.trim() === '') {
        clearFieldError($(this), false);
      } else {
        const res = FormValidator.validatePhone(val, false);
        if (res.valid) clearFieldError($(this), true);
      }
    });

    $topic.on('change', function () {
      const res = FormValidator.validateSelect($(this).val(), 'an inquiry category');
      if (res.valid) clearFieldError($(this), true);
    });

    $subject.on('input', function () {
      const res = FormValidator.validateText($(this).val(), 'Subject', 3, 120, true);
      if (res.valid) clearFieldError($(this), true);
    });

    $message.on('input', function () {
      const res = FormValidator.validateMessage($(this).val(), 10, 2000, true);
      if (res.valid) clearFieldError($(this), true);
    });

    // Form Submit Handler
    $contactForm.on('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let $firstInvalid = null;

      function checkField($f, testRes) {
        if (!testRes.valid) {
          showFieldError($f, testRes.message);
          isValid = false;
          if (!$firstInvalid) $firstInvalid = $f;
        } else {
          clearFieldError($f, true);
        }
      }

      checkField($name, FormValidator.validateName($name.val(), 'Full Name'));
      checkField($email, FormValidator.validateEmail($email.val(), true));

      const phoneVal = $phone.val();
      if (phoneVal && phoneVal.trim() !== '') {
        checkField($phone, FormValidator.validatePhone(phoneVal, false));
      } else {
        clearFieldError($phone, false);
      }

      checkField($topic, FormValidator.validateSelect($topic.val(), 'an inquiry category'));
      checkField($subject, FormValidator.validateText($subject.val(), 'Subject', 3, 120, true));
      checkField($message, FormValidator.validateMessage($message.val(), 10, 2000, true));

      if (!isValid) {
        if ($firstInvalid) {
          $firstInvalid.focus();
          $firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Prevent duplicate submissions with loading state
      const $submitBtn = $contactForm.find('button[type="submit"]');
      if ($submitBtn.prop('disabled')) return;

      const originalBtnHtml = $submitBtn.html();
      $submitBtn.prop('disabled', true).addClass('btn-loading');
      $submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Message...');

      const submittedName = $name.val().trim();

      setTimeout(function () {
        $submitBtn.prop('disabled', false).removeClass('btn-loading').html(originalBtnHtml);

        showFormAlert(
          $contactForm,
          'success',
          'Message Sent Successfully!',
          `Thank you, <strong>${escapeHtml(submittedName)}</strong>. Your inquiry has been received. Our team will review your message and respond shortly.`
        );

        showFrontendToast(
          'Message Sent Successfully',
          `Thank you, <strong>${escapeHtml(submittedName)}</strong>! Your inquiry has been received. Our team will review your message and get in touch with you shortly.`,
          'bi-check-circle-fill text-success'
        );

        $contactForm[0].reset();
        $contactForm.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
      }, 750);
    });
  }

  // --------------------------------------------------------------------------
  // Volunteer Form Validation & Handler (#volunteerDemoForm)
  // --------------------------------------------------------------------------
  const $volunteerForm = $('#volunteerDemoForm');
  if ($volunteerForm.length) {
    const $vName = $('#volFullName');
    const $vEmail = $('#volEmail');
    const $vLocation = $('#volLocation');
    const $vInterest = $('#volInterest');
    const $vMessage = $('#volMessage');

    // Real-time clearance listeners
    $vName.on('input', function () {
      const res = FormValidator.validateName($(this).val(), 'Full Name');
      if (res.valid) clearFieldError($(this), true);
    });

    $vEmail.on('input', function () {
      const res = FormValidator.validateEmail($(this).val(), true);
      if (res.valid) clearFieldError($(this), true);
    });

    $vLocation.on('input', function () {
      const res = FormValidator.validateText($(this).val(), 'City or location', 2, 80, true);
      if (res.valid) clearFieldError($(this), true);
    });

    $vInterest.on('change', function () {
      const res = FormValidator.validateSelect($(this).val(), 'an area of interest');
      if (res.valid) clearFieldError($(this), true);
    });

    $vMessage.on('input', function () {
      const res = FormValidator.validateMessage($(this).val(), 10, 2000, true);
      if (res.valid) clearFieldError($(this), true);
    });

    // Form Submit Handler
    $volunteerForm.on('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let $firstInvalid = null;

      function checkField($f, testRes) {
        if (!testRes.valid) {
          showFieldError($f, testRes.message);
          isValid = false;
          if (!$firstInvalid) $firstInvalid = $f;
        } else {
          clearFieldError($f, true);
        }
      }

      checkField($vName, FormValidator.validateName($vName.val(), 'Full Name'));
      checkField($vEmail, FormValidator.validateEmail($vEmail.val(), true));
      checkField($vLocation, FormValidator.validateText($vLocation.val(), 'City or location', 2, 80, true));
      checkField($vInterest, FormValidator.validateSelect($vInterest.val(), 'an area of interest'));
      checkField($vMessage, FormValidator.validateMessage($vMessage.val(), 10, 2000, true));

      if (!isValid) {
        if ($firstInvalid) {
          $firstInvalid.focus();
          $firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Prevent duplicate submissions with loading state
      const $submitBtn = $volunteerForm.find('button[type="submit"]');
      if ($submitBtn.prop('disabled')) return;

      const originalBtnHtml = $submitBtn.html();
      $submitBtn.prop('disabled', true).addClass('btn-loading');
      $submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting Application...');

      const submittedName = $vName.val().trim();

      setTimeout(function () {
        $submitBtn.prop('disabled', false).removeClass('btn-loading').html(originalBtnHtml);

        showFormAlert(
          $volunteerForm,
          'success',
          'Application Submitted!',
          `Thank you, <strong>${escapeHtml(submittedName)}</strong>. We appreciate your dedication to helping our community. Our volunteer coordinator will contact you shortly.`
        );

        showFrontendToast(
          'Thank You for Applying',
          `Thank you, <strong>${escapeHtml(submittedName)}</strong>! We appreciate your willingness to support our community. Our coordinator will review your application and be in touch soon.`,
          'bi-heart-fill text-terracotta'
        );

        $volunteerForm[0].reset();
        $volunteerForm.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
      }, 750);
    });
  }

  // --------------------------------------------------------------------------
  // Donation Form Validation & Handler (#demoDonationForm)
  // --------------------------------------------------------------------------
  const $donationForm = $('#demoDonationForm');
  if ($donationForm.length) {
    const $amountInput = $('#customAmountInput');
    const $donorName = $('#donorName');
    const $donorEmail = $('#donorEmail');

    // Real-time clearance listeners
    $amountInput.on('input', function () {
      const res = FormValidator.validateDonationAmount($(this).val());
      if (res.valid) clearFieldError($(this), true);
    });

    $donorName.on('input', function () {
      const res = FormValidator.validateName($(this).val(), 'Full Name');
      if (res.valid) clearFieldError($(this), true);
    });

    $donorEmail.on('input', function () {
      const res = FormValidator.validateEmail($(this).val(), true);
      if (res.valid) clearFieldError($(this), true);
    });

    // Form Submit Handler
    $donationForm.on('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let $firstInvalid = null;

      function checkField($f, testRes) {
        if (!testRes.valid) {
          showFieldError($f, testRes.message);
          isValid = false;
          if (!$firstInvalid) $firstInvalid = $f;
        } else {
          clearFieldError($f, true);
        }
      }

      checkField($amountInput, FormValidator.validateDonationAmount($amountInput.val()));
      checkField($donorName, FormValidator.validateName($donorName.val(), 'Full Name'));
      checkField($donorEmail, FormValidator.validateEmail($donorEmail.val(), true));

      if (!isValid) {
        if ($firstInvalid) {
          $firstInvalid.focus();
          $firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Prevent duplicate submissions with loading state
      const $submitBtn = $donationForm.find('button[type="submit"]');
      if ($submitBtn.prop('disabled')) return;

      const originalBtnHtml = $submitBtn.html();
      $submitBtn.prop('disabled', true).addClass('btn-loading');
      $submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing Donation...');

      const fund = $('input[name="donationFund"]:checked').val() || 'General Mission';
      const amount = Number($amountInput.val()).toFixed(2);
      const frequency = $('.giving-type-btn.active').data('frequency') || 'One-Time';
      const donor = $donorName.val().trim();

      setTimeout(function () {
        $submitBtn.prop('disabled', false).removeClass('btn-loading').html(originalBtnHtml);

        showFormAlert(
          $donationForm,
          'success',
          'Thank You for Your Generosity!',
          `Thank you, <strong>${escapeHtml(donor)}</strong>! You selected a <strong>${frequency}</strong> contribution of <strong>$${amount}</strong> toward <strong>${escapeHtml(fund)}</strong>. Your support helps bring life-changing assistance to communities and animals in need.`
        );

        showFrontendToast(
          'Thank You for Your Generosity',
          `You selected a <strong>${frequency}</strong> contribution of <strong>$${amount}</strong> toward <strong>${escapeHtml(fund)}</strong>. Thank you for your support and commitment to our mission!`,
          'bi-heart-fill text-terracotta'
        );

        $donorName.val('');
        $donorEmail.val('');
        $donationForm.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
      }, 750);
    });
  }


  // 8. Interactive Donation Controls (donate.html)
  // Frequency button click
  $('.giving-type-btn').on('click', function () {
    $('.giving-type-btn').removeClass('active');
    $(this).addClass('active');
    const freq = $(this).data('frequency');
    $('#selectedFrequencyText').text(freq);
  });

  // Preset amount button click
  $('.btn-amount-preset').on('click', function () {
    $('.btn-amount-preset').removeClass('btn-forest text-white').addClass('btn-outline-forest');
    $(this).removeClass('btn-outline-forest').addClass('btn-forest text-white');
    const amt = $(this).data('amount');
    $('#customAmountInput').val(amt);
    $('#summaryAmountText').text('$' + amt);
  });

  // Custom amount input change
  $('#customAmountInput').on('input', function () {
    const val = $(this).val();
    $('.btn-amount-preset').removeClass('btn-forest text-white').addClass('btn-outline-forest');
    if (val && !isNaN(val) && Number(val) > 0) {
      $('#summaryAmountText').text('$' + val);
    } else {
      $('#summaryAmountText').text('$0');
    }
  });

  // Giving Fund Cards selection
  $('.giving-fund-card').on('click', function () {
    $('.giving-fund-card').removeClass('selected');
    $(this).addClass('selected');
    const radio = $(this).find('input[type="radio"]');
    radio.prop('checked', true);
    const fundName = $(this).data('fund-name');
    $('#summaryFundText').text(fundName);
  });

  // 9. Policy Tab Navigation (policies.html)
  $('.policy-nav-link').on('click', function (e) {
    e.preventDefault();
    $('.policy-nav-link').removeClass('active');
    $(this).addClass('active');
    const target = $(this).attr('href');
    $('.policy-card-target').hide();
    $(target).fadeIn(200);

    // Scroll smoothly to target on mobile
    if ($(window).width() < 992) {
      $('html, body').animate({
        scrollTop: $(target).offset().top - 90
      }, 300);
    }
  });

  // Helper for escaping user input to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 10. Hero Carousel Initialization & Video Slider Management
  const carouselEl = document.getElementById('heroCarousel');
  let heroCarouselInstance = null;

  if (carouselEl) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
      heroCarouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: 7000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true
      });
    }

    // Helper: Play the active slide's video and pause inactive videos
    function syncVideoPlayback() {
      const activeItem = carouselEl.querySelector('.carousel-item.active');
      if (activeItem) {
        const activeVideo = activeItem.querySelector('video');
        if (activeVideo) {
          activeVideo.muted = true; // Required for reliable browser autoplay
          const playPromise = activeVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(function (err) {
              console.warn('Hero video autoplay deferred until user interaction:', err);
            });
          }
        }
      }

      // Pause inactive slide videos to reduce CPU/GPU resource usage (Requirement 7)
      carouselEl.querySelectorAll('.carousel-item:not(.active) video').forEach(function (video) {
        video.pause();
      });
    }

    // Initial playback sync on DOM ready and window load
    syncVideoPlayback();
    window.addEventListener('load', syncVideoPlayback);

    // One-time interaction fallback to unlock autoplay on strict mobile/desktop policies
    const unlockAutoplay = function () {
      syncVideoPlayback();
      window.removeEventListener('click', unlockAutoplay);
      window.removeEventListener('touchstart', unlockAutoplay);
    };
    window.addEventListener('click', unlockAutoplay, { once: true });
    window.addEventListener('touchstart', unlockAutoplay, { once: true });

    // Transition start: start incoming video immediately for smooth crossfade
    carouselEl.addEventListener('slide.bs.carousel', function (e) {
      if (e.relatedTarget) {
        const nextVideo = e.relatedTarget.querySelector('video');
        if (nextVideo) {
          nextVideo.muted = true;
          const p = nextVideo.play();
          if (p !== undefined) p.catch(function () {});
        }
      }
    });

    // Transition end: pause inactive videos and ensure active video is playing
    carouselEl.addEventListener('slid.bs.carousel', function () {
      syncVideoPlayback();
    });

    // Pause videos when user switches tab or minimizes to reduce resource usage
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        carouselEl.querySelectorAll('video').forEach(function (v) {
          v.pause();
        });
      } else {
        syncVideoPlayback();
      }
    });

    // Accessible Play / Pause Toggle Button
    let isCarouselPlaying = true;
    $('#carouselTogglePlay').on('click', function () {
      const activeVideo = carouselEl.querySelector('.carousel-item.active video');
      if (isCarouselPlaying) {
        if (heroCarouselInstance) {
          heroCarouselInstance.pause();
        } else {
          $(carouselEl).carousel('pause');
        }
        $(this).find('i').removeClass('bi-pause-fill').addClass('bi-play-fill');
        $(this).attr('aria-label', 'Play slideshow');
        $(this).attr('title', 'Play slideshow');
        isCarouselPlaying = false;
      } else {
        if (heroCarouselInstance) {
          heroCarouselInstance.cycle();
        } else {
          $(carouselEl).carousel('cycle');
        }
        if (activeVideo && activeVideo.paused) {
          activeVideo.play().catch(function () {});
        }
        $(this).find('i').removeClass('bi-play-fill').addClass('bi-pause-fill');
        $(this).attr('aria-label', 'Pause slideshow');
        $(this).attr('title', 'Pause slideshow');
        isCarouselPlaying = true;
      }
    });
  }

  // 11. Accessible Tap & Keyboard Support for Card Reveal Boxes
  // Supports mobile touch devices without hover, and keyboard Enter/Space
  $(document).on('click keydown', '.card-reveal-box', function (e) {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
      return;
    }
    // Don't intercept clicks on internal interactive links or buttons
    if ($(e.target).closest('a, button').length) {
      return;
    }

    if (e.type === 'keydown') {
      e.preventDefault();
    }

    const $box = $(this);
    const isRevealed = $box.hasClass('is-revealed');

    // Close other revealed cards for clean single-focus experience
    $('.card-reveal-box').not($box).removeClass('is-revealed').attr('aria-expanded', 'false');

    if (isRevealed) {
      $box.removeClass('is-revealed').attr('aria-expanded', 'false');
    } else {
      $box.addClass('is-revealed').attr('aria-expanded', 'true');
    }
  });

  // Close revealed cards when clicking/tapping outside
  $(document).on('click touchstart', function (e) {
    if (!$(e.target).closest('.card-reveal-box').length) {
      $('.card-reveal-box').removeClass('is-revealed').attr('aria-expanded', 'false');
    }
  });

  // Escape key closes open card reveals
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      $('.card-reveal-box').removeClass('is-revealed').attr('aria-expanded', 'false');
    }
  });


  // ==========================================================================
  // 12. Premium Center Donation Popup Modal Controller
  // Exact Display & Dismissal Rules:
  // 1. "Donate Now" button click:
  //    - Saves permanent dismissal flag in localStorage (meo_care_donation_modal_dismissed)
  //    - Never displays modal again on any page, reload, or return from donation page
  // 2. Cross (×) button click:
  //    - Closes modal immediately
  //    - Does NOT save permanent dismissal flag
  //    - Allows modal to appear again after 10 seconds of active browsing
  // 3. "Maybe Later" button click:
  //    - Closes modal immediately
  //    - Does NOT save permanent dismissal flag
  //    - Allows modal to appear again after 10 seconds of active browsing
  // 4. Website-wide consistency:
  //    - Checked on every page before timer starts or modal displays
  //    - Only "Donate Now" permanently suppresses the modal
  //    - Design, animations, and responsive layout remain 100% intact
  // ==========================================================================
  function initDonationModal() {
    const MODAL_ID = 'meoDonationModal';
    const DISMISSED_KEY = 'meo_care_donation_modal_dismissed';
    const INTERVAL_MS = 4000; // 4 seconds

    // 1. Storage Helpers — uses sessionStorage so dismissal resets each new browser session
    function isPermanentlyDismissed() {
      try {
        return sessionStorage.getItem(DISMISSED_KEY) === 'true';
      } catch (err) {
        return false;
      }
    }

    function setPermanentlyDismissed() {
      try {
        sessionStorage.setItem(DISMISSED_KEY, 'true');
        // Also clear any old localStorage flag from previous versions
        try { localStorage.removeItem(DISMISSED_KEY); } catch (e) {}
      } catch (err) {}
    }

    // 2. If user already clicked "Donate Now" previously, never display or start timers
    if (isPermanentlyDismissed()) {
      return;
    }

    // Ensure single instance in DOM across all pages
    let $modal = $('#' + MODAL_ID);
    if (!$modal.length) {
      const modalHtml = `
        <div id="${MODAL_ID}" class="meo-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="meoModalTitle" aria-describedby="meoModalDesc" style="display: none;">
          <div class="meo-modal-dialog">
            <div class="meo-modal-rainbow-bar"></div>
            <button type="button" class="meo-modal-close-btn" id="meoModalCloseBtn" aria-label="Close donation popup">
              <i class="bi bi-x-lg"></i>
            </button>
            <div class="meo-modal-img-wrap">
              <img src="assets/images/family-support.jpg" alt="Children smiling with hope" class="meo-modal-img">
              <div class="meo-modal-img-gradient"></div>
              <div class="meo-modal-floating-icon">
                <i class="bi bi-heart-fill"></i>
              </div>
            </div>
            <div class="meo-modal-body">
              <span class="meo-modal-pill">
                <i class="bi bi-stars"></i> Make a Difference
              </span>
              <h3 class="meo-modal-heading" id="meoModalTitle">Be the Reason Someone Smiles</h3>
              <p class="meo-modal-text" id="meoModalDesc">
                Your kindness can help us support vulnerable communities and provide compassionate care for animals.
              </p>
              <div class="meo-modal-highlights">
                <span class="highlight-chip"><i class="bi bi-basket2 text-blue"></i> Food Relief</span>
                <span class="highlight-chip"><i class="bi bi-heart-pulse text-green"></i> Animal Care</span>
                <span class="highlight-chip"><i class="bi bi-shield-check text-yellow"></i> 100% Direct</span>
              </div>
              <div class="meo-modal-actions">
                <a href="donate.html" class="btn btn-meo-donate-modal" id="meoModalDonateBtn">
                  <span>Donate Now</span>
                  <i class="bi bi-arrow-right"></i>
                </a>
                <button type="button" class="btn-meo-later" id="meoModalLaterBtn">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      $('body').append(modalHtml);
      $modal = $('#' + MODAL_ID);

      // Direct element click bindings
      $modal.find('#meoModalCloseBtn').on('click', function (e) {
        e.preventDefault();
        closeModalTemporary();
      });
      $modal.find('#meoModalLaterBtn').on('click', function (e) {
        e.preventDefault();
        closeModalTemporary();
      });
      $modal.find('#meoModalDonateBtn').on('click', function (e) {
        closeModalPermanently();
      });
    }

    let popupTimer = null;
    let remainingTime = INTERVAL_MS;
    let lastStartTime = 0;
    let isOpen = false;
    let previousActiveElement = null;

    function showModal() {
      // Never show if permanently dismissed
      if (isPermanentlyDismissed()) {
        clearTimeout(popupTimer);
        popupTimer = null;
        return;
      }
      if (isOpen) return;
      if (document.hidden) return; // Tab inactive

      isOpen = true;
      clearTimeout(popupTimer);
      popupTimer = null;
      previousActiveElement = document.activeElement;

      $modal.css('display', 'flex');
      // Trigger reflow for smooth scale/fade CSS transition
      void $modal[0].offsetWidth;
      $modal.addClass('is-open');

      // Accessibility: focus Donate Now button
      setTimeout(function () {
        const $donateBtn = $('#meoModalDonateBtn');
        if ($donateBtn.length) {
          $donateBtn.focus();
        }
      }, 60);
    }

    // Temporary close (used by Cross button, Maybe Later, Backdrop, Escape)
    function closeModalTemporary() {
      if (!isOpen) return;
      isOpen = false;
      clearTimeout(popupTimer);
      popupTimer = null;

      $modal.removeClass('is-open');
      setTimeout(function () {
        if (!isOpen) {
          $modal.css('display', 'none');
        }
      }, 360);

      // Restore user focus
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        try {
          previousActiveElement.focus();
        } catch (err) {}
      }

      // Allow modal to appear again after existing 10-second delay (if not permanently dismissed)
      if (!isPermanentlyDismissed()) {
        startTimer(INTERVAL_MS);
      }
    }

    // Permanent close (used strictly by "Donate Now" action)
    function closeModalPermanently() {
      setPermanentlyDismissed();
      isOpen = false;
      clearTimeout(popupTimer);
      popupTimer = null;
      $modal.removeClass('is-open').css('display', 'none');
    }

    function startTimer(duration) {
      if (isPermanentlyDismissed()) return;
      clearTimeout(popupTimer);
      remainingTime = duration;
      lastStartTime = Date.now();

      if (!document.hidden && !isOpen) {
        popupTimer = setTimeout(function () {
          showModal();
        }, remainingTime);
      }
    }

    function pauseTimer() {
      clearTimeout(popupTimer);
      popupTimer = null;
      if (lastStartTime > 0) {
        const elapsed = Date.now() - lastStartTime;
        remainingTime = Math.max(0, remainingTime - elapsed);
      }
    }

    function resumeTimer() {
      if (isPermanentlyDismissed()) return;
      if (!isOpen && !document.hidden) {
        if (remainingTime <= 0) {
          remainingTime = INTERVAL_MS;
        }
        lastStartTime = Date.now();
        popupTimer = setTimeout(function () {
          showModal();
        }, remainingTime);
      }
    }

    // 1. Cross (×) button: Close immediately, do NOT save permanent dismissal, reappear after 10s
    $(document).on('click', '#meoModalCloseBtn', function (e) {
      e.preventDefault();
      closeModalTemporary();
    });

    // 2. "Maybe Later" button: Close immediately, do NOT save permanent dismissal, reappear after 10s
    $(document).on('click', '#meoModalLaterBtn', function (e) {
      e.preventDefault();
      closeModalTemporary();
    });

    // 3. "Donate Now" button: Save permanent dismissal flag BEFORE navigating, never show again
    $(document).on('click', '#meoModalDonateBtn', function (e) {
      closeModalPermanently();
      // Browser navigation continues naturally to donate.html
    });

    // Also permanently suppress if user clicks any direct link to donate.html
    $(document).on('click', 'a[href="donate.html"], a[href*="donate.html"]', function () {
      setPermanentlyDismissed();
      if (isOpen) {
        closeModalPermanently();
      }
    });

    // 4. Click outside dialog on backdrop: Closes temporarily, reappears after 10s
    $modal.on('click', function (e) {
      if ($(e.target).closest('.meo-modal-dialog').length === 0) {
        closeModalTemporary();
      }
    });

    // 5. Escape key: Closes temporarily, reappears after 10s
    $(document).on('keydown', function (e) {
      if (isOpen && (e.key === 'Escape' || e.keyCode === 27)) {
        e.preventDefault();
        closeModalTemporary();
      }
    });

    // 6. Tab visibility pause / resume
    document.addEventListener('visibilitychange', function () {
      if (isPermanentlyDismissed()) return;
      if (document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    });

    // 7. Window blur & focus
    window.addEventListener('blur', function () {
      if (!isPermanentlyDismissed()) pauseTimer();
    });
    window.addEventListener('focus', function () {
      if (!isPermanentlyDismissed()) resumeTimer();
    });

    // 8. Cross-tab synchronization — sessionStorage is tab-local, no cross-tab sync needed
    // (Removed: was localStorage-based, no longer applicable)

    // 9. Back/Forward Cache (bfcache) navigation handling
    window.addEventListener('pageshow', function (e) {
      if (isPermanentlyDismissed()) {
        clearTimeout(popupTimer);
        popupTimer = null;
        if (isOpen) {
          $modal.removeClass('is-open').css('display', 'none');
          isOpen = false;
        }
      }
    });

    // Initial 10-second delay for visitors
    startTimer(INTERVAL_MS);
  }

  initDonationModal();

});