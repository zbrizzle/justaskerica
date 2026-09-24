/* Just Ask Erica — Main JS */

// ── CONFIG ────────────────────────────────────────────────────────────────────
// 1. Replace with your Beehiiv publication ID once you have it
//    (Settings → Publication → API Keys in Beehiiv)
const BEEHIIV_PUB_ID = 'pub_ac107a13-1e0e-4cc7-bfcd-bf0b57a14379';

// 2. Paste your Google Apps Script Web App URL here after setup (see README)
const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyfVh0_OUX_29Az0OS8gZwInjcJMkWzw3kw7hjyFvhanlCDMo-QVL0rZt0xvSfhDtCV6w/exec';

// 3. Path to the PDF relative to site root
const PDF_PATH = '/guide/just-ask-erica-longevity-guide.pdf';
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ---- CATEGORY FILTER ----
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.article-card[data-category]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  // ---- EMAIL FORMS ----
  document.querySelectorAll('.js-email-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) { emailInput.focus(); return; }

      const btn = form.querySelector('button[type="submit"], button');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // 1. Trigger PDF download immediately — no API dependency
      triggerDownload(PDF_PATH);

      // 2. Send to Google Sheets (fire-and-forget)
      sendToSheets(email);

      // 3. Send to Beehiiv (fire-and-forget, only if pub ID is set)
      sendToBeehiiv(email);

      // 4. Redirect to welcome page after a brief moment so the download starts
      setTimeout(() => {
        if (form.dataset.redirect) {
          window.location.href = form.dataset.redirect;
        } else {
          btn.textContent = '✓ Check your downloads!';
        }
      }, 800);
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

// ── HELPERS ───────────────────────────────────────────────────────────────────

function triggerDownload(path) {
  const a = document.createElement('a');
  a.href = path;
  a.download = 'Just-Ask-Erica-Longevity-Guide.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function sendToBeehiiv(email) {
    fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
    }).catch(() => {}); // silent — not user-facing
}

function sendToSheets(email) {
  if (!SHEETS_WEBHOOK || SHEETS_WEBHOOK === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;
  fetch(SHEETS_WEBHOOK, {
    method: 'POST',
        mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ email, source: window.location.pathname, ts: new Date().toISOString() })
  }).catch(() => {}); // silent — not user-facing
}
// ===== ASK ERICA QUESTION BOX =====
function ericaSubmitQuestion() {
  const q = document.getElementById('question-input').value.trim();
  if (!q) { document.getElementById('question-input').focus(); return; }
  document.getElementById('question-preview').textContent = '\u201c' + q + '\u201d';
  document.getElementById('step-question').style.display = 'none';
  document.getElementById('step-email').style.display = 'flex';
  document.getElementById('secondary-cta').style.display = 'none';
}

function ericaUnlockAnswer() {
  const email = document.getElementById('email-input').value.trim();
  if (!email || !email.includes('@')) { document.getElementById('email-input').focus(); return; }

  // Submit email to Beehiiv + Sheets
  sendToBeehiiv(email);
  sendToSheets(email);

  // Show a sample answer (replace with real AI call later)
  document.getElementById('answer-text').innerHTML =
    '<p>Great question. Based on the current research, this is an area where we have some solid animal data but limited human trials. The evidence suggests meaningful benefits in the right context — but as always, the quality of source and individual factors matter a lot.</p>' +
    '<p>For a personalized take, a consult with a longevity-focused clinician is always the best next step.</p>';

  document.getElementById('step-email').style.display = 'none';
  document.getElementById('step-answer').style.display = 'flex';
}

function ericaGoBack() {
  document.getElementById('step-email').style.display = 'none';
  document.getElementById('step-question').style.display = 'flex';
  document.getElementById('secondary-cta').style.display = 'block';
}

// Allow Enter to submit question (Shift+Enter for newline)
document.addEventListener('DOMContentLoaded', function() {
  const qi = document.getElementById('question-input');
  if (qi) {
    qi.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ericaSubmitQuestion(); }
    });
  }
});
