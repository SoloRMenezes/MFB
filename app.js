'use strict';
const messages = JSON.parse(document.getElementById('messages').textContent);
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', messages.menu);
  nav.classList.remove('open');
}
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? messages.close : messages.menu);
  nav.classList.toggle('open', expanded);
});
const language = document.querySelector('.language');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (language.open) { language.open = false; language.querySelector('summary').focus(); }
    if (toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
  }
});
document.addEventListener('click', event => {
  if (!language.contains(event.target)) language.open = false;
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const form = document.getElementById('enquiry');
if (form) {
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const panel = document.getElementById('summary-panel');
  const status = document.getElementById('form-status');
  fields.forEach(field => field.addEventListener('input', () => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    panel.hidden = true;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const error = document.getElementById('form-error');
    error.textContent = '';
    const invalid = fields.find(field => !field.value.trim() || !field.checkValidity());
    if (invalid) {
      error.textContent = `${messages[invalid.name]}: ${invalid.validity.typeMismatch ? messages.invalid : messages.required}`;
      invalid.setAttribute('aria-invalid', 'true');
      invalid.setAttribute('aria-describedby', 'form-error');
      invalid.focus();
      panel.hidden = true;
      return;
    }
    document.getElementById('summary').value = fields.map(field => `${messages[field.name]}: ${field.value.trim()}`).join('\n\n');
    panel.hidden = false;
    status.textContent = messages.prepared;
    document.getElementById('summary').focus();
  });
  document.getElementById('copy').addEventListener('click', async () => {
    const summary = document.getElementById('summary');
    try {
      await navigator.clipboard.writeText(summary.value);
      status.textContent = messages.copied;
    } catch {
      summary.focus(); summary.select(); status.textContent = messages.copyfail;
    }
  });
}
