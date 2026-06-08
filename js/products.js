/* ================================================================
   SPARPLE .INC — PRODUCT CONTENT SYSTEM  (js/products.js)
   ================================================================

   HOW TO ADD A NEW PRODUCT
   ─────────────────────────────────────────────────────────────────
   1. Create  /products/myapp.json   (copy aero.json as a template)
   2. Add  "myapp"  to  /products/manifest.json
   3. Push to GitHub — done. No other files need to change.

   The manifest.json is the ONLY source of truth for the product
   list. This script never scans directories or requires a server.
   ================================================================ */


// ── Load the product manifest ─────────────────────────────────────
// Returns an array of product IDs from /products/manifest.json.
// Falls back to an empty array if the file is missing.
async function loadManifest() {
  try {
    const res = await fetch('products/manifest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    console.warn('[Sparple] Could not load products/manifest.json:', err);
    return [];
  }
}


// ── Fetch one product JSON ────────────────────────────────────────
// Returns null (not a crash) when a file is missing or malformed.
async function loadProduct(id) {
  try {
    const res = await fetch(`products/${id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Sparple] Could not load product "${id}":`, err);
    return null;
  }
}


// ── SVG icons for platform badges ─────────────────────────────────
function platformIcon(type) {
  const icons = {
    android: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a.5.5 0 01-.523.092C15.117 14.643 13.5 14 12 14s-3.117.643-4.999 1.433a.5.5 0 01-.523-.092L4.5 13.5A10.938 10.938 0 0112 11c2.87 0 5.5 1.1 7.5 2.9l-1.977 1.441zM12 4C7.582 4 4 7.582 4 12a7.97 7.97 0 001.755 5.005l1.46-1.063A6 6 0 016 12c0-3.314 2.686-6 6-6s6 2.686 6 6a6 6 0 01-1.215 3.642l1.46 1.063A7.97 7.97 0 0020 12c0-4.418-3.582-8-8-8zm0 6a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
    ios:     `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`,
    offline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    web:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke-linecap="round"/></svg>`,
    privacy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  return icons[type] || icons['web'];
}


// ── GitHub Banner HTML ────────────────────────────────────────────
function githubBannerHTML() {
  return `
    <section class="github-banner">
      <a href="https://github.com/muhmmadansal-dot/sparple"
         target="_blank"
         rel="noopener noreferrer"
         class="github-banner-inner">
        <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
        <span class="github-banner-text">View on GitHub</span>
        <svg class="github-arrow" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </section>`;
}


// ── Homepage: render product cards ────────────────────────────────
async function renderHomepageProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const ids      = await loadManifest();
  const products = (await Promise.all(ids.map(loadProduct))).filter(Boolean);

  if (products.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const hp   = p.homepage;
    const tags = (hp.cardTags || []).map(t => `<span>${t}</span>`).join('');
    return `
      <div class="product-card-hero reveal-scroll">
        <div class="product-card-bg"></div>
        <div class="product-card-inner">
          <div class="product-icon">
            ${hp.cardIcon || ''}
          </div>
          <div class="product-card-text">
            <h3>${hp.cardTitle}</h3>
            <p>${hp.cardBody}</p>
            <div class="product-tags">${tags}</div>
            <a href="product.html?id=${p.id}" class="btn-primary">
              <span>${hp.cardCtaLabel}</span>
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>`;
  }).join('');

  // Inject GitHub banner after product grid
  grid.insertAdjacentHTML('afterend', githubBannerHTML());

  initScrollReveal();
}


// ── Product page: render full page ───────────────────────────────
async function renderProductPage() {
  const pageEl = document.getElementById('product-page');
  if (!pageEl) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) return showProductError('No product specified.');

  const p = await loadProduct(id);
  if (!p) return showProductError(`Product "${id}" not found.`);

  document.title = p.meta.title;

  const platformsHTML = (p.hero.platforms || []).map(pl => `
    <div class="platform-badge ${pl.type === 'offline' ? 'offline' : ''}">
      ${platformIcon(pl.type)}
      ${pl.label}
    </div>`).join('');

  const featuresHTML = (p.features || []).map(f => `
    <div class="feature-card ${f.size || ''}">
      <div class="feature-icon">${f.icon || ''}</div>
      <h4>${f.title}</h4>
      <p>${f.body}</p>
    </div>`).join('');

  const stepsHTML = (p.steps || []).map((s, i) => `
    <div class="step">
      <div class="step-num">0${i + 1}</div>
      <h4>${s.title}</h4>
      <p>${s.body}</p>
    </div>
    ${i < p.steps.length - 1 ? '<div class="step-connector"></div>' : ''}
  `).join('');

  pageEl.innerHTML = `
    <section class="iw-hero">
      <div class="iw-hero-content">
        <a href="index.html" class="back-link">Sparple .inc</a>
        <h1>${p.hero.name}</h1>
        <p>${p.hero.tagline}</p>
        ${platformsHTML}
        <a href="${p.hero.ctaHref}" class="btn-primary">${p.hero.ctaLabel}</a>
      </div>
    </section>

    <section class="iw-features">
      ${featuresHTML}
    </section>

    <section class="iw-how">
      ${stepsHTML}
    </section>

    ${githubBannerHTML()}
  `;

  initScrollReveal();
}


// ── Error state ───────────────────────────────────────────────────
function showProductError(msg) {
  const el = document.getElementById('product-page');
  if (el) el.innerHTML = `<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;"><p style="color:var(--text-muted);font-family:var(--font-mono);font-size:.8rem;">${msg}</p></div>`;
}


// ── Scroll reveal (called after dynamic HTML is injected) ─────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-scroll');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    obs.observe(el);
  });
}


// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderHomepageProducts();
  renderProductPage();
});
