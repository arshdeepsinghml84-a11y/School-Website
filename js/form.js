/* ====================================================================
   RIVERSTONE ACADEMY — FORM.JS
   Handles: contact form validation (name, email, phone, message)
   with accessible inline error messages and a success confirmation.
   No backend is wired up — this simulates a submission for the demo.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('contact-form');
  if (!form) return;

  var successMsg = document.getElementById('form-success');

  var fields = {
    name: {
      input: document.getElementById('cf-name'),
      error: document.getElementById('err-name'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your full name.';
        if (value.trim().length < 2) return 'Name looks too short.';
        return '';
      }
    },
    email: {
      input: document.getElementById('cf-email'),
      error: document.getElementById('err-email'),
      validate: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Please enter your email address.';
        if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    phone: {
      input: document.getElementById('cf-phone'),
      error: document.getElementById('err-phone'),
      validate: function (value) {
        var digitsOnly = value.replace(/\D/g, '');
        if (!value.trim()) return 'Please enter your phone number.';
        if (digitsOnly.length < 10) return 'Phone number should have at least 10 digits.';
        return '';
      }
    },
    message: {
      input: document.getElementById('cf-message'),
      error: document.getElementById('err-message'),
      validate: function (value) {
        if (!value.trim()) return 'Please add a short message.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  /* ---------------------------------------------------------------
     VALIDATE A SINGLE FIELD AND REFLECT STATE IN THE UI
  --------------------------------------------------------------- */
  function validateField(key) {
    var field = fields[key];
    if (!field.input) return true;

    var errorMsg = field.validate(field.input.value);

    if (errorMsg) {
      field.input.classList.add('invalid');
      field.input.setAttribute('aria-invalid', 'true');
      field.error.textContent = errorMsg;
      return false;
    } else {
      field.input.classList.remove('invalid');
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
      return true;
    }
  }

  /* ---------------------------------------------------------------
     VALIDATE ON BLUR (so errors don't appear while the user is
     still typing their first pass through the form)
  --------------------------------------------------------------- */
  Object.keys(fields).forEach(function (key) {
    var input = fields[key].input;
    if (!input) return;

    input.addEventListener('blur', function () { validateField(key); });

    // Re-validate on input once a field has already shown an error,
    // so the message clears as soon as it's fixed
    input.addEventListener('input', function () {
      if (input.classList.contains('invalid')) validateField(key);
    });
  });

  /* ---------------------------------------------------------------
     FORM SUBMISSION
  --------------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = Object.keys(fields).reduce(function (valid, key) {
      var fieldValid = validateField(key);
      return valid && fieldValid;
    }, true);

    if (!allValid) {
      // Move focus to the first invalid field for accessibility
      var firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      if (successMsg) successMsg.hidden = true;
      return;
    }

    // Simulate a successful submission (no backend connected)
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      form.reset();
      Object.keys(fields).forEach(function (key) {
        fields[key].input.classList.remove('invalid');
        fields[key].input.removeAttribute('aria-invalid');
        fields[key].error.textContent = '';
      });
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.focus && successMsg.focus();
        setTimeout(function () { successMsg.hidden = true; }, 6000);
      }
    }, 900);
  });

});
