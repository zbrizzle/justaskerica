# Just Ask Erica

Science-first wellness blog. Static HTML site deployed on Netlify via GitHub.

## Setup

### 1. Add Erica's photos
- `images/erica-hero.jpg` — hero photo (portrait, min 1200px wide)
- `images/erica-avatar.jpg` — small circle avatar (400×400px)

Then uncomment the `<img>` tags in `index.html`, `free-guide.html`, and `articles/bpc-157.html` and remove the placeholder divs.

### 2. Connect Beehiiv
1. Create account at beehiiv.com
2. Create a publication for Just Ask Erica
3. Get your Publication ID from Settings → API
4. Open `js/main.js` and replace `YOUR_BEEHIIV_PUB_ID` with your actual ID

### 3. Add the PDF guide
- Upload your guide PDF to `guide/just-ask-erica-longevity-guide.pdf`
- The download button on `welcome.html` links there automatically

### 4. Deploy to Netlify
1. Push this repo to GitHub
2. Connect repo to Netlify (New site → Import from Git)
3. Build settings: no build command, publish directory = `.`
4. Set custom domain: justaskerica.com

## Adding new articles

1. Copy `articles/bpc-157.html` to a new file, e.g. `articles/tirzepatide.html`
2. Update the title, meta description, badge category, and body content
3. Add a thumbnail image: `images/thumb-tirzepatide.jpg`
4. Add the article card to `index.html` in the article grid
5. Push to GitHub — Netlify auto-deploys in ~30 seconds

## Automated posting with Claude

Use Claude Desktop or Claude Code to:
1. Write the article content as HTML following the template in `articles/bpc-157.html`
2. Save it to the `articles/` folder
3. Add the card to `index.html`
4. Commit and push to GitHub

Netlify detects the push and redeploys automatically. No login, no drag and drop.

## File structure
```
justaskerica/
├── index.html          ← Homepage
├── free-guide.html     ← Squeeze page (Meta ad lander)
├── welcome.html        ← Thank-you / download page
├── about.html          ← About Erica
├── disclaimer.html     ← Medical disclaimer
├── privacy.html        ← Privacy policy
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Filter, forms, nav
├── images/             ← Photos and thumbnails
├── guide/              ← PDF guide goes here
├── articles/           ← Individual article pages
│   └── bpc-157.html    ← Template article
└── netlify.toml        ← Netlify config
```
