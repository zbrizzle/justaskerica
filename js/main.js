/* Just Ask Erica — Main JS */

// ---- CATEGORY FILTER ----
document.addEventListener('DOMContentLoaded', () => {

  // Filter pills
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.article-card[data-category]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.filter;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---- EMAIL FORMS ----
  // Beehiiv embed — replace PUBLICATION_ID with your actual Beehiiv publication ID
  const BEEHIIV_PUB_ID = 'YOUR_BEEHIIV_PUB_ID';

  function submitToBeehiiv(email, formEl) {
    const btn = formEl.querySelector('button[type="submit"], button');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, reactivate_existing: true })
    })
    .then(r => {
      if (r.ok) {
        // Redirect to thank you / download page
        if (formEl.dataset.redirect) {
          window.location.href = formEl.dataset.redirect;
        } else {
          btn.textContent = '✓ You\'re in!';
        }
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    })
    .catch(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    });
  }

  document.querySelectorAll('.js-email-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.focus();
        return;
      }
      submitToBeehiiv(email, form);
    });
  });

  // ---- MOBILE NAV ----
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? '' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '58px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#fff';
      navLinks.style.padding = '16px 24px';
      navLinks.style.borderBottom = '0.5px solid #e8e2d9';
      navLinks.style.zIndex = '99';
    });
  }

});
