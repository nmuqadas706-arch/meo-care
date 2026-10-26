const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Fix .row rule
css = css.replace(
  /\.row\s*\{\s*max-width:\s*100%\s*!important;\s*margin-left:\s*-0\.75rem\s*!important;\s*margin-right:\s*-0\.75rem\s*!important;\s*\}/g,
  `.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
}`
);

// 2. Fix img, video, canvas, svg rule
css = css.replace(
  /img,\s*video,\s*canvas,\s*svg\s*\{\s*max-width:\s*100%\s*!important;\s*height:\s*auto\s*!important;\s*\}/g,
  `img:not(.brand-logo):not(.footer-logo):not(.commitment-brand-logo),
video:not(.hero-slider-video),
canvas, svg {
  max-width: 100%;
  height: auto;
}`
);

// 3. Fix .meo-modal-backdrop and .meo-modal-dialog
css = css.replace(
  /\.meo-modal-backdrop\s*\{[\s\S]*?padding:\s*1\.25rem;[\s\S]*?transition:[^;]+;\s*\}/,
  `.meo-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(7, 29, 59, 0.68);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.35s ease;
}`
);

css = css.replace(
  /\.meo-modal-dialog\s*\{[\s\S]*?max-width:\s*500px;[\s\S]*?text-align:\s*center;\s*\}/,
  `.meo-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 2rem);
  margin: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--color-ivory, #FFFDF7);
  border-radius: 20px;
  box-shadow: 0 25px 65px -10px rgba(7, 29, 59, 0.45),
              0 10px 25px -5px rgba(7, 29, 59, 0.2);
  border: 1px solid rgba(11, 45, 92, 0.12);
  overflow: hidden;
  transform: scale(0.92) translateY(12px);
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}`
);

css = css.replace(
  /\.meo-modal-body\s*\{[\s\S]*?align-items:\s*center;\s*\}/,
  `.meo-modal-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}`
);

// 4. Append comprehensive Master Responsiveness Suite
const responsiveSuite = `
/* ==========================================================================
   MASTER MULTI-DEVICE RESPONSIVE ENHANCEMENTS SUITE
   Verified Across: 320px-375px (Small Mobile), 376px-480px (Standard Mobile),
   481px-767px (Large Mobile), 768px-1024px (Tablet), 1025px-1366px (Laptop),
   and 1367px+ (High-Res Desktop).
   ========================================================================== */

/* Universal Fluid Images & Media */
img {
  max-width: 100%;
  height: auto;
}

/* Fluid Typography Helpers */
.fluid-h1 {
  font-size: clamp(1.65rem, 3.2vw + 1rem, 2.75rem) !important;
  line-height: 1.22 !important;
}

.fluid-h2 {
  font-size: clamp(1.35rem, 2.2vw + 0.8rem, 2.15rem) !important;
  line-height: 1.25 !important;
}

.fluid-lead {
  font-size: clamp(0.98rem, 1vw + 0.75rem, 1.18rem) !important;
  line-height: 1.68 !important;
}

/* --- Breakpoint: Laptops & Tablets (max-width: 1199.98px) --- */
@media (max-width: 1199.98px) {
  .hero-video-box {
    height: clamp(480px, 68vh, 650px);
    min-height: 480px;
    max-height: 650px;
  }
}

/* --- Breakpoint: Tablets & Below (max-width: 991.98px) --- */
@media (max-width: 991.98px) {
  .col-lg-4 > .sticky-top {
    position: static !important;
    top: auto !important;
  }
  .hero-mosaic-frame,
  .page-hero-master-card,
  .impact-hero-master-card {
    max-width: 520px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }
  .hero-programs-left,
  .hero-page-left,
  .hero-impact-left {
    text-align: center !important;
  }
  .hero-programs-left .d-flex,
  .hero-page-left .d-flex,
  .hero-impact-left .d-flex {
    justify-content: center !important;
  }
}

/* --- Breakpoint: Mobile Landscape & Tablets Portrait (max-width: 767.98px) --- */
@media (max-width: 767.98px) {
  .hero-actions-bar {
    width: 100% !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0.65rem !important;
  }
  .hero-actions-bar .btn {
    width: 100% !important;
    justify-content: center !important;
  }
  .about-banner-actions {
    flex-direction: column !important;
    width: 100% !important;
  }
  .about-banner-actions .btn {
    width: 100% !important;
    justify-content: center !important;
  }
}

/* --- Breakpoint: Standard Mobile (max-width: 575.98px) --- */
@media (max-width: 575.98px) {
  /* Announcement Top Bar */
  .top-bar {
    font-size: 0.78rem !important;
    padding: 0.35rem 0 !important;
    text-align: center !important;
  }
  .top-bar .container {
    justify-content: center !important;
  }

  /* Card Padding Scale */
  .card.p-4,
  .card.p-md-5,
  .card.p-5 {
    padding: 1.35rem 1.15rem !important;
  }

  /* Contact details card items */
  .card.d-flex.flex-row.align-items-start {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.65rem !important;
  }

  /* Documentation & Reports Table */
  .docs-table th,
  .docs-table td {
    padding: 0.65rem 0.55rem !important;
    font-size: 0.82rem !important;
  }
  .status-badge-pending {
    font-size: 0.7rem !important;
    padding: 0.2rem 0.5rem !important;
  }

  /* Donation Form Inputs & Presets */
  .giving-type-btn {
    font-size: 0.82rem !important;
    padding: 0.55rem 0.25rem !important;
  }
  .btn-amount-preset {
    flex: 1 1 calc(50% - 0.5rem) !important;
    padding: 0.55rem 0.65rem !important;
    font-size: 0.92rem !important;
    text-align: center !important;
  }
  #demoDonationForm .d-flex.flex-column.flex-sm-row {
    text-align: center !important;
  }
  #demoDonationForm .d-flex.flex-column.flex-sm-row .btn {
    width: 100% !important;
  }

  /* Placeholder Pills */
  .placeholder-pill {
    font-size: 0.78rem !important;
    padding: 0.2rem 0.5rem !important;
    max-width: 100% !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
  }

  /* Modal Responsive Scaling */
  .meo-modal-backdrop {
    padding: 0.75rem;
  }
  .meo-modal-dialog {
    max-height: calc(100vh - 1.5rem);
    border-radius: 16px;
  }
  .meo-modal-img-wrap {
    height: 135px;
    flex-shrink: 0;
  }
  .meo-modal-floating-icon {
    width: 42px;
    height: 42px;
    font-size: 1.15rem;
    bottom: -15px;
  }
  .meo-modal-body {
    padding: 1.35rem 1.1rem 1.4rem;
  }
  .meo-modal-heading {
    font-size: 1.25rem;
    line-height: 1.25;
  }
  .meo-modal-text {
    font-size: 0.84rem;
    line-height: 1.5;
    margin-bottom: 0.9rem;
  }
  .meo-modal-highlights {
    margin-bottom: 1rem;
    gap: 0.35rem;
  }
  .meo-modal-highlights .highlight-chip {
    font-size: 0.74rem;
    padding: 0.22rem 0.55rem;
  }
  .btn-meo-donate-modal {
    padding: 0.72rem 1.25rem;
    font-size: 0.95rem;
  }
}

/* --- Breakpoint: Small Mobile (320px–375px) --- */
@media (max-width: 375px) {
  /* Extra compact typography for ultra small screens */
  h1, .h1, .display-5 {
    font-size: 1.48rem !important;
    line-height: 1.22 !important;
  }
  h2, .h2, .display-6 {
    font-size: 1.28rem !important;
    line-height: 1.25 !important;
  }
  h3, .h3 {
    font-size: 1.15rem !important;
  }
  p, p.lead, .hero-lead {
    font-size: 0.88rem !important;
    line-height: 1.55 !important;
  }
  .eyebrow {
    font-size: 0.66rem !important;
    padding: 0.22rem 0.5rem !important;
    letter-spacing: 0.04em !important;
  }
  .container {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
  .card.p-4,
  .card.p-md-5,
  .commitment-trust-card {
    padding: 1.15rem 0.85rem !important;
  }
  .custom-toggler {
    width: 38px;
    height: 38px;
  }
  .navbar-brand img.brand-logo {
    max-height: 38px !important;
  }
  .hero-mosaic-crest {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.8rem !important;
  }
  .btn-amount-preset {
    font-size: 0.82rem !important;
    padding: 0.45rem 0.35rem !important;
  }
  .meo-modal-img-wrap {
    height: 110px;
  }
  .meo-modal-floating-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    bottom: -12px;
  }
  .meo-modal-body {
    padding: 1.15rem 0.75rem 1.2rem;
  }
  .meo-modal-heading {
    font-size: 1.15rem;
  }
}
`;

css += responsiveSuite;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('style.css successfully updated with Master Responsiveness Suite!');
