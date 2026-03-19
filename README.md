# Allure Beauty Salon — Booth Rental Website

Static site targeting experienced hair stylists for booth/suite rental in Evansville, IN.
**Primary conversion goal:** "Apply to Rent a Booth" — NOT appointment booking.

---

## File Structure

```
Allure Beauty Salon/
├── css/styles.css          # All design tokens + layout + components
├── js/app.js               # Form stepper, validation, nav behavior, FAQ accordion
├── index.html              # Homepage
├── booth-rental.html       # What's included / model explainer
├── apply.html              # 3-step application form (primary conversion page)
├── about.html              # Brand story (Ruth Bindle)
├── faq.html                # Licensing, lease, move-in FAQ
├── contact.html            # General inquiries (NOT appointment booking)
├── CONTENT_SPEC.md         # Agent A: all copy, CTAs, microcopy per page
├── WIREFRAMES_SPEC.md      # Agent B: section order, stepper UX, design tokens
├── SEO_CHECKLIST.md        # Agent D: per-page SEO audit + patches applied
├── A11Y_PERF_REVIEW.md     # Agent E: accessibility + performance audit + patches
├── COLD_VISITOR_REVIEW.md  # Agent F: cold first-impression review + priority fixes
└── README.md               # This file
```

---

## Before Launch: Required Actions

### 🔴 CRITICAL (site non-functional without these)

**1. Wire up the form endpoint**
- Open `js/app.js`
- Find: `const FORM_SUBMIT_ENDPOINT = 'REPLACE_ME';`
- Replace `'REPLACE_ME'` with your actual form backend URL
- Options: Formspree (`https://formspree.io/f/YOUR_ID`), Netlify Forms, or your own endpoint

**2. Add real contact information (NAP — must be consistent everywhere)**
- Search all `.html` files for `[ADDRESS_PLACEHOLDER]`, `[ZIP_PLACEHOLDER]`, `[PHONE_PLACEHOLDER]`, `[HOURS_PLACEHOLDER]`
- Replace with real values in: visible page copy + JSON-LD structured data (in each page `<head>`)
- NAP must match exactly across all 6 pages and your Google Business Profile

**3. Replace hero/image gradients with real photos**
- Every image slot is a CSS gradient placeholder
- Replace `.hero__bg`, `.about__image`, `.booth-hero`, and amenity section backgrounds with real salon photos
- Minimum needed: 1 hero photo (wide, high-quality interior), 1 suite/station close-up

**4. Add real pricing**
- `booth-rental.html` has a `<!-- TODO: Confirm weekly and/or monthly rental rates -->` comment
- Stylists will not apply without at least a range — add "Starting at $X/week" if you can

### 🟡 HIGH PRIORITY (affects trust and conversion)

**5. Replace placeholder testimonials**
- All 3 testimonials on `index.html` are marked `<!-- TODO: Replace with real tenant testimonial -->`
- Get quotes from 1–2 current or past tenants before launch

**6. Write Ruth Bindle's real brand story**
- `about.html` has placeholder paragraphs with prompts like `[RUTH: describe your inspiration...]`
- The About page is entirely placeholder — this directly affects trust

**7. Create a Privacy Policy page**
- `apply.html` Step 3 has a consent checkbox linking to `/privacy-policy.html` which does not exist
- Either create the page or update the link

**8. Add real OG image**
- All pages reference `/images/og-default.jpg` (does not exist)
- Create an `images/` folder and add a 1200×630px salon photo as `og-default.jpg`

### 🟢 BEFORE GOING LIVE (polish)

**9. Confirm brand color hex values**
In `css/styles.css`, find the `/* TODO: confirm HEX values */` block and replace:
```css
--brand-brown: #6B4F3A;       /* TODO: confirm */
--brand-offwhite: #F5F0EB;    /* TODO: confirm */
--brand-pink: #D4A5A5;        /* TODO: confirm */
--brand-green: #4A7C6F;       /* TODO: confirm */
--brand-blue: #3A5A7C;        /* TODO: confirm */
--brand-neutral: #8C8C8C;     /* TODO: confirm */
--brand-turquoise: #2A8C8C;   /* TODO: confirm */
```

**10. Add Contact page to desktop nav**
- `contact.html` is currently missing from the desktop nav link list on all pages
- Add it or confirm nav is intentionally 4-item only

**11. Fix mobile nav focus trap**
- When the mobile hamburger menu is open, Tab focus can escape the overlay
- Add a JS focus trap (`focusin` listener) to keep keyboard users inside the nav while it's open
- Flagged in `A11Y_PERF_REVIEW.md` as the only remaining HIGH accessibility item

**12. Add Google Business Profile**
- Register at business.google.com with category "Beauty Salon" or "Hair Salon"
- NAP on GBP must match the site exactly
- Upload interior/exterior photos
- Request reviews from current/past tenants

---

## Design System Quick Reference

### Theme
- Default: **dark** (dark background, light text) — set in `:root`
- Light override: add class `light` to `<html>` or `<body>`

### Colors (CSS variables)
| Token | Dark value | Purpose |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#141414` | Cards, panels |
| `--color-text-primary` | `#f0ede8` | Body text |
| `--color-text-secondary` | `#9e9e9e` | Labels, captions |
| `--color-accent` | `#c9a87c` | Buttons, highlights |
| `--color-border` | `#2a2a2a` | Borders, dividers |

### Typography
- Display/headings: Playfair Display (serif) — `var(--font-display)`
- Body: Lora (serif) — `var(--font-body)`
- UI labels/mono: Space Mono (monospace) — `var(--font-ui)`

---

## Development

No build step required. Open any `.html` file directly in a browser, or serve locally:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`

---

## Deployment Notes

- Pure static site — deploy to any host: Railway, Netlify, Vercel, GitHub Pages, Cloudflare Pages
- No server-side dependencies
- Form submission requires a third-party endpoint (Formspree recommended — see Step 1 above)
- Set up a custom domain and ensure HTTPS before going live (required for form trust signals)

---

## Keyword Targets (for ongoing content/SEO)

Primary:
- `booth rental evansville in`
- `salon suite rental evansville`
- `hair booth rental evansville`
- `beauty suite for rent evansville`

Secondary:
- `booth rent hair stylist evansville indiana`
- `salon suite evansville`
- `independent stylist workspace evansville`

---

*Built with Claude Code — multi-agent pipeline (Agents A–F). See spec files for full documentation.*
