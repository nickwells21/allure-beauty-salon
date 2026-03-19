# WIREFRAMES SPEC — Allure Beauty Salon
**Project:** Allure Beauty Salon — Booth & Salon Suite Rental Recruitment Site
**Location:** Evansville, Indiana
**Primary Goal:** Recruit experienced hair stylists for booth/salon suite rental
**Design Direction:** Loftgarten / Godly aesthetic — big hero, large type, agency/case-study vibe, clean minimal nav, strong typography hierarchy
**Theme:** Dark-first (CSS custom properties), neutral palette with brand accents
**Spec Author:** Agent B (Wireframes)
**Implementation:** Agent C reads this file directly — no ambiguity permitted

---

## 1. GLOBAL LAYOUT

### 1.1 Content Container

- Max content width: **1280px**, centered via `margin-inline: auto`
- Horizontal padding: `--space-5` (40px) on desktop, `--space-3` (24px) on tablet, `--space-2` (16px) on mobile
- Base spacing unit: **8px grid** — all spacing values are multiples of 8px

### 1.2 Navigation

**Desktop (≥ 1024px):**

```
[ ALLURE LOGO ]  ......................  [ About ]  [ Booth Rental ]  [ FAQ ]  [ Apply to Rent a Booth → ]
```

- Logo: far left, text or SVG mark, links to index.html
- Nav links: right-aligned, 3 text links + 1 CTA button at far right
- Nav links: About, Booth Rental, FAQ
- CTA button: "Apply to Rent a Booth" — uses `--color-accent`, contrasts on dark nav bg
- Nav background: `--color-bg` at full opacity when sticky; transparent over hero before scroll
- Sticky behavior: position fixed after scrolling past 80px. Add `data-scrolled` attribute to `<nav>` element at that threshold. CSS transitions opacity/bg on that attribute.
- Nav height: 72px
- Typography: `--font-ui` (monospace), font-size 13px, letter-spacing 0.08em, uppercase

**Mobile (< 1024px):**

- Logo left, hamburger icon right (3-line SVG, 44x44px tap target)
- On hamburger tap: full-screen overlay menu slides in from right or fades in
- Overlay: `--color-bg` background, nav links stacked vertically, 48px min height per item
- CTA button visible in mobile overlay, full-width
- Close: X icon top-right of overlay, or tap outside overlay
- No hamburger animation required beyond icon swap (hamburger ↔ X)

### 1.3 Footer

**Desktop (≥ 768px) — 2-column layout:**

```
[ Brand Column (left ~40%)          ]  [ Links Column (right ~60%)                     ]
  ALLURE BEAUTY SALON                    Site: Home  |  Booth Rental  |  About  |  FAQ
  Evansville, Indiana                    Contact us: contact.html
  tagline or brief brand note            Apply: apply.html
  © 2025 Allure Beauty Salon
```

- Brand column: logo/wordmark, location, short descriptor line, copyright
- Links column: inline link groups or 2-column sub-grid of links; Contact and Apply links prominent
- Footer background: `--color-surface` (slightly lighter than `--color-bg`)
- Top border: 1px solid `--color-border`
- Padding top/bottom: `--space-8` (64px)
- Typography: `--font-ui`, 12px, `--color-text-secondary`

**Mobile (< 768px) — stacked:**

- Brand column on top, links column below
- Each stacked, full-width
- Padding: `--space-5` (40px) top/bottom

---

## 2. index.html — SECTION ORDER

### Section 1: Hero

**Purpose:** Immediate impact. Full viewport. Large type. Single CTA.

**Layout:**
- Height: `100vh` (minimum 600px)
- Background: full-bleed image (placeholder: `images/hero-placeholder.jpg`), `object-fit: cover`, `object-position: center`
- Overlay: semi-transparent dark gradient over image — `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)` — ensures text legibility on any photo
- Content: absolutely positioned, centered vertically at ~45% from top (slightly above center for visual weight)
- Max content width: 900px centered

**Content (top to bottom within hero):**
1. Eyebrow label: `"EVANSVILLE, INDIANA"` — `--font-ui`, 11px, letter-spacing 0.14em, uppercase, `--brand-offwhite` at 70% opacity
2. Headline: `"Your Chair. Your Clients. Your Business."` — `--font-display`, **desktop: 80px / line-height 1.0**, **mobile: 40px / line-height 1.1**, color `--color-text-primary` (near white on dark)
3. Subheadline: `"Allure Beauty Salon offers premium booth rentals in Evansville. Join a community of independent stylists with everything you need to grow."` — `--font-body`, **desktop: 20px**, **mobile: 16px**, `--color-text-secondary`, max-width 560px
4. CTA Button: "Apply to Rent a Booth" — links to apply.html, primary button style (see Design Tokens), min 200px wide
5. Secondary text link (optional): "Learn about our spaces →" — links to booth-rental.html, `--font-ui`, 13px, underline on hover

**Parallax rule:**
- Desktop (≥ 1024px): hero background image moves at ~0.4x scroll speed (`background-attachment: fixed` or JS scroll handler). Use `will-change: transform` on the image element if using JS.
- Mobile (< 1024px): `background-attachment: scroll` — NO parallax, NO JS scroll effects. Parallax disabled entirely.

**Spacing:**
- CTA button: `--space-5` margin-top from subheadline
- Subheadline: `--space-3` margin-top from headline
- Headline: `--space-2` margin-top from eyebrow

---

### Section 2: Benefits Strip

**Purpose:** Quickly communicate 3–4 reasons to rent a booth at Allure.

**Layout:**
- Background: `--color-surface`
- Padding: `--space-8` (64px) top/bottom
- Inner: CSS Grid, `grid-template-columns: repeat(3, 1fr)` on desktop, `repeat(2, 1fr)` on tablet (≥ 600px), `1fr` on mobile
- Gap: `--space-5` (40px)
- Border-top: 1px solid `--color-border`

**Each card/column (3 or 4 items):**
```
[ Icon — 32x32px SVG, --color-accent ]
[ Headline — 18px --font-ui uppercase letter-spacing ]
[ One-line copy — 14px --font-body --color-text-secondary ]
```

**Suggested benefit items (placeholder copy — implementation can adjust):**
1. Icon: key / door — Headline: "Booth & Suite Rentals" — Copy: "Private suites and open chair rentals to fit any stage of your career."
2. Icon: calendar — Headline: "Set Your Own Schedule" — Copy: "Work the hours that work for you. Total flexibility, zero compromise."
3. Icon: scissors / sparkle — Headline: "Premium Salon Environment" — Copy: "High-end equipment, clean facilities, and a professional atmosphere."
4. Icon: community/people — Headline: "Supportive Community" — Copy: "Surround yourself with motivated stylists who lift each other up."

If 4 items: grid becomes `repeat(4, 1fr)` on desktop, `repeat(2, 1fr)` on tablet.

---

### Section 3: Social Proof / "Who's Here"

**Purpose:** Legitimize the salon by showing existing renters or community. Placeholder content at build time.

**Layout:**
- Background: `--color-bg`
- Padding: `--space-10` (80px) top/bottom
- Section label: `"WHO RENTS HERE"` — `--font-ui`, 11px, letter-spacing 0.14em, uppercase, `--color-accent`, centered
- Section headline: e.g., `"Stylists Who've Made Allure Home"` — `--font-display`, 40px desktop / 28px mobile, centered, max-width 600px
- Sub-copy: 1–2 sentences, `--font-body`, 16px, `--color-text-secondary`, centered, max-width 500px

**Content block:**
- Placeholder: 2–3 stylist "quote cards" in a horizontal row (desktop) or stacked (mobile)
- Each card: `--color-surface` background, `--radius-md` border radius, `--space-5` padding
  - Placeholder avatar circle: 48px, `--color-border` background
  - Quote text: `--font-body` italic, 15px
  - Name + title: `--font-ui`, 12px, uppercase, `--color-accent`
- Note in HTML comment: `<!-- PLACEHOLDER: Replace with real stylist testimonials -->`

---

### Section 4: How It Works

**Purpose:** Reduce friction by explaining the rental process in 3 clear steps.

**Layout:**
- Background: `--color-surface`
- Padding: `--space-10` (80px) top/bottom
- Section label: `"THE PROCESS"` — same eyebrow style as Section 3
- Section headline: `"How Booth Rental Works"` — `--font-display`, 40px desktop / 28px mobile, centered
- Steps container: CSS Flex or Grid, 3 items in a row on desktop (≥ 768px), stacked on mobile
- Connector line between steps on desktop: thin horizontal line `--color-border`, decorative only (aria-hidden)

**Each step:**
```
[ Step number — large, --font-display, 64px, --color-accent, 30% opacity ]
[ Step headline — --font-ui, 14px, uppercase, letter-spacing ]
[ Step copy — --font-body, 15px, --color-text-secondary, max 2 sentences ]
```

**Step content (placeholder):**
1. **Apply** — "Fill out our short application. Tell us about your experience and what you're looking for."
2. **Tour & Talk** — "We'll reach out to schedule a walkthrough and answer any questions about booth pricing and availability."
3. **Move In** — "Sign your rental agreement and start building your business in your new space."

---

### Section 5: CTA Banner

**Purpose:** Final conversion push on the homepage.

**Layout:**
- Background: `--color-accent` (or high-contrast variant — ensure text contrast ratio ≥ 4.5:1 against `--color-bg` text)
- Padding: `--space-9` (72px) top/bottom
- Content: centered, single column
- Headline: `"Ready to Own Your Career?"` — `--font-display`, 48px desktop / 32px mobile, color contrasting on accent bg
- Sub-copy: 1 short sentence — `--font-body`, 18px
- Button: "Apply to Rent a Booth" — inverted button style on accent background (e.g., white bg, dark text, or outline variant)
- Button min-width: 220px

---

### Section 6: Footer

See Section 1.3 Global Footer above.

---

## 3. booth-rental.html — SECTION ORDER

### Section 1: Page Hero

**Purpose:** Orient the user; this is the deeper-dive page on the rental offering.

**Layout:**
- Height: `~50vh` (minimum 400px)
- Background: full-bleed image (placeholder: `images/booth-hero-placeholder.jpg`), dark overlay same as index hero
- Content: bottom-aligned within hero, flush left inside max-width container
- Eyebrow: `"BOOTH & SUITE RENTAL"` — same eyebrow style
- Headline: `"A Space Built for Your Best Work"` — `--font-display`, 60px desktop / 36px mobile, line-height 1.05
- No CTA button in hero on this page (avoid premature ask)
- Parallax: same rule as index hero (desktop only)

---

### Section 2: Intro Text Block

**Purpose:** Short, punchy narrative about the rental philosophy/offering.

**Layout:**
- Background: `--color-bg`
- Padding: `--space-9` top/bottom
- Max content width: 720px, centered
- Body copy: 2–3 paragraphs, `--font-body`, 18px, `--color-text-primary`, line-height 1.75
- No columns — full-width single column for reading comfort
- Optional pull quote: one sentence styled large (`--font-display`, 28px, `--color-accent`), left-border decoration `4px solid --color-accent`, padding-left `--space-3`

---

### Section 3: Amenities Grid

**Purpose:** Show everything included in the rental (tangible checklist feel).

**Layout:**
- Background: `--color-surface`
- Padding: `--space-9` top/bottom
- Section headline: `"What's Included"` — `--font-display`, 36px, left-aligned (not centered)
- Grid: `grid-template-columns: repeat(2, 1fr)` on desktop (≥ 768px), `1fr` on mobile
- Gap: `--space-4` (32px) horizontal, `--space-3` (24px) vertical
- Max 12 items recommended (can be more)

**Each item:**
```
[ Icon — 24px SVG, --color-accent, inline-block, margin-right --space-2 ]
[ Label — --font-ui, 14px, --color-text-primary, uppercase, letter-spacing 0.06em ]
```

Items sit on one horizontal row (icon + label), no extra copy per item. Clean checklist style.

**Suggested amenity items (placeholder):**
- Shampoo bowls + styling stations
- High-speed Wi-Fi
- On-site laundry
- Secure product storage
- Free client parking
- Retail display space available
- Air conditioning / climate control
- Color mixing bar
- Break room access
- 24/7 keycard access
- Professional reception area
- Security cameras on premises

---

### Section 4: "Who It's For" — Split Layout

**Purpose:** Qualify the ideal renter so applicants self-select.

**Layout:**
- Background: `--color-bg`
- Padding: `--space-10` top/bottom
- Desktop: CSS Grid `grid-template-columns: 1fr 1fr`, gap `--space-8`
  - Left column: image (placeholder `images/stylist-working-placeholder.jpg`), `border-radius: --radius-lg`, `object-fit: cover`, height 480px
  - Right column: content block, vertically centered within grid row
- Mobile: stacked — image on top (height 280px), content below

**Right column content:**
- Eyebrow: `"WHO IT'S FOR"` — standard eyebrow style
- Headline: `"Built for Independent Stylists"` — `--font-display`, 36px desktop / 26px mobile
- Body copy: 3–4 short paragraphs or a bulleted list of ideal renter traits, `--font-body`, 16px
- Bullet items (suggested):
  - "You have an established or growing client base"
  - "You want control over your pricing and services"
  - "You're done giving away commission"
  - "You take pride in your craft and your space"
- CTA link (not full button): "See if it's right for you →" links to apply.html, `--font-ui`, 13px, `--color-accent`, underline on hover

---

### Section 5: Secondary CTA Banner

Same structure as index.html Section 5 (CTA Banner). Headline: `"Spaces Are Limited — Apply Today"`.

---

### Section 6: Footer

See Section 1.3 Global Footer.

---

## 4. apply.html — SECTION ORDER + STEPPER UX

### Section 1: Minimal Page Header

**Layout:**
- Background: `--color-bg`
- Padding: `--space-7` (56px) top, `--space-5` (40px) bottom
- Headline: `"Apply to Rent a Booth"` — `--font-display`, 48px desktop / 32px mobile, centered
- Sub-copy: `"It takes about 3 minutes. We review all applications personally."` — `--font-body`, 16px, `--color-text-secondary`, centered
- No background image, no hero — keep this page focused on the form

---

### Section 2: Multi-Step Application Form

#### 2a. Stepper Indicator

**Structure:**
```
[ Step 1: About You ]  ——  [ Step 2: Your Practice ]  ——  [ Step 3: Final Details ]
     (active)                    (remaining)                    (remaining)
```

**Markup pattern:**
```html
<nav aria-label="Application steps">
  <ol role="list" class="stepper">
    <li class="stepper__step stepper__step--active" aria-current="step">
      <span class="stepper__number">1</span>
      <span class="stepper__label">About You</span>
    </li>
    <li class="stepper__step stepper__step--remaining">
      <span class="stepper__number">2</span>
      <span class="stepper__label">Your Practice</span>
    </li>
    <li class="stepper__step stepper__step--remaining">
      <span class="stepper__number">3</span>
      <span class="stepper__label">Final Details</span>
    </li>
  </ol>
</nav>
```

**Visual states:**
- `.stepper__step--completed`: number circle filled `--color-accent`, checkmark icon replaces number, label `--color-text-secondary`
- `.stepper__step--active`: number circle outline `--color-accent`, number text `--color-accent`, label `--color-text-primary`, font-weight bold
- `.stepper__step--remaining`: number circle outline `--color-border`, number `--color-text-secondary`, label `--color-text-secondary`
- Connector line between steps: `--color-border`, 1px, `aria-hidden="true"`, decorative only
- On mobile: stepper collapses to `"Step 1 of 3 — About You"` text label only (no horizontal row of circles). Use CSS to hide full stepper and show compact version at < 640px.

---

#### 2b. Step 1 — About You

**Required fields:**

| Field | Type | Validation |
|---|---|---|
| Full Name | `<input type="text">` | Required, min 2 chars |
| Email Address | `<input type="email">` | Required, valid email format |
| Phone Number | `<input type="tel">` | Required, min 10 digits |
| License Type | `<select>` | Required — options: "Cosmetology License", "Esthetics License", "Barber License", "Other" |
| Years of Experience | `<select>` | Required — options: "Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years" |
| Primary Specialty | `<input type="text">` | Required, placeholder: "e.g., Color, Cuts, Extensions, Lashes" |

**Layout:** Single column on all breakpoints. Label above input. `--space-4` (32px) gap between fields.

---

#### 2c. Step 2 — Your Practice

**Fields:**

| Field | Type | Validation |
|---|---|---|
| Current Booking Model | `<fieldset>` with 2 `<input type="radio">` | Required — options: "I have my own established clients", "I'm still building my clientele" |
| Expected Move-In Date | `<input type="date">` or `<select>` with month options | Required |
| Portfolio or Instagram Link | `<input type="url">` | Optional, placeholder: "https://instagram.com/yourhandle" |

**Radio field layout:**
- `<fieldset>` with `<legend>` for grouping — legend text: "How would you describe your current client base?"
- Each radio: custom styled, min 44px height, `--space-2` gap between options
- Selected state: `--color-accent` indicator

---

#### 2d. Step 3 — Final Details

**Fields:**

| Field | Type | Validation |
|---|---|---|
| Why booth rental? | `<textarea>` | Required, minlength="50", placeholder: "Tell us why you're interested in booth rental and what you're looking for in a salon home..." |
| Reference 1 — Name | `<input type="text">` | Optional |
| Reference 1 — Phone | `<input type="tel">` | Optional |
| Reference 2 — Name | `<input type="text">` | Optional |
| Reference 2 — Phone | `<input type="tel">` | Optional |
| Permission to Contact | `<input type="checkbox">` | Required — label: "I give Allure Beauty Salon permission to contact me about my application via phone or email." |

**References block layout:** Two side-by-side fields per reference row (name left, phone right) on desktop (≥ 640px), stacked on mobile.

**Textarea:** Min-height 120px, resize vertical only.

---

#### 2e. Step Navigation Buttons

**Layout (per step):**
```
[ ← Back ]                                    [ Next Step → ]
                    (Step 1: Back is hidden)
                    (Step 3: Next becomes "Submit Application")
```

- "Back" button: ghost/outline style, `--color-text-secondary`, always enabled when visible. Hidden on Step 1.
- "Next" / "Submit" button: primary style (`--color-accent` bg), disabled until all required fields on current step are valid
- Disabled state: `opacity: 0.45`, `cursor: not-allowed`, no pointer events
- Both buttons: min-height 48px, min-width 140px
- Spacing: `--space-6` (48px) margin-top from last field

---

#### 2f. Error States

- **Trigger:** On "Next" click attempt when required fields are invalid; or on blur for individual fields
- **Field error:** `border: 2px solid var(--color-error)` (define `--color-error: #e53e3e` or similar red)
- **Error message:** `<p role="alert" class="field-error">` immediately below the field, `--font-ui`, 12px, `--color-error` text
- **Focus management:** On "Next" click with errors, `focus()` jumps to the first field with an error
- **ARIA:** `aria-invalid="true"` on the field element, `aria-describedby` pointing to the error message element

---

#### 2g. Success State

- **Trigger:** On successful form submission (Step 3 submit)
- **Behavior:** Replace the entire stepper + form section with a confirmation block. Do NOT navigate to a new page. Use JS to swap display.
- **Confirmation block:**
  - Icon: large checkmark SVG, `--color-accent`, 64px
  - Headline: `"Application Received"` — `--font-display`, 40px
  - Body: `"Thank you, [First Name]. We'll review your application and reach out within 2–3 business days."` — `--font-body`, 18px
  - Link: "Back to Home" → index.html, styled as text link
- **Accessibility:** `role="status"` on the confirmation container, or use `aria-live="polite"` region that was pre-placed in the DOM

---

#### 2h. Mobile Form Rules

- Single column for all fields — no side-by-side on mobile
- All inputs: min-height **44px** (touch target)
- All `<select>` elements: native browser select, min-height 44px, full width
- Font-size: minimum **16px** on all inputs (prevents iOS auto-zoom)
- Textarea: min-height 120px
- Button tap targets: min 48px height, full-width on mobile
- No placeholder-only labels — visible `<label>` elements required above every field

---

## 5. about.html — SECTION ORDER

### Section 1: Hero with Brand Story Headline

**Layout:**
- Height: `~55vh` (minimum 420px)
- Background: full-bleed image (placeholder: `images/about-hero-placeholder.jpg`), dark overlay
- Content: vertically centered
- Eyebrow: `"OUR STORY"` — standard eyebrow style
- Headline: `"More Than a Salon. A Home for Your Career."` — `--font-display`, 56px desktop / 34px mobile
- No CTA on hero
- Parallax: desktop only

---

### Section 2: Story Block — Split Layout

**Layout:**
- Background: `--color-bg`
- Padding: `--space-10` top/bottom
- Desktop: CSS Grid `grid-template-columns: 1fr 1fr`, gap `--space-8`
  - Left: image placeholder (`images/salon-interior-placeholder.jpg`), `border-radius: --radius-lg`, `object-fit: cover`, height 500px
  - Right: text block, vertically centered
- Mobile: stacked — image on top (height 260px), text below

**Right column content:**
- Headline: `"Built by a Stylist, for Stylists"` — `--font-display`, 32px desktop / 24px mobile
- Body copy: 3–5 paragraphs, `--font-body`, 17px, line-height 1.8, `--color-text-primary`
- Placeholder note in comment: `<!-- Replace with owner's personal backstory -->`

---

### Section 3: Values / Pillars

**Layout:**
- Background: `--color-surface`
- Padding: `--space-9` top/bottom
- Section eyebrow: `"OUR VALUES"` — standard style, centered
- Section headline: `"What We Stand For"` — `--font-display`, 36px, centered
- 3-column grid on desktop (≥ 768px), single column on mobile
- Gap: `--space-6`

**Each pillar:**
```
[ Icon — 36px SVG, --color-accent, centered ]
[ Headline — --font-ui, 15px, uppercase, letter-spacing, centered, margin-top --space-3 ]
[ Copy — --font-body, 15px, --color-text-secondary, centered, max-width 260px ]
```

**Suggested values:**
1. Icon: handshake — "Mutual Respect" — "We treat every stylist as a professional peer, not an employee."
2. Icon: lock/shield — "Your Independence" — "No commission, no scripts. Your clients, your prices, your rules."
3. Icon: sparkle/star — "Craft First" — "We invest in an environment that makes great work possible."

---

### Section 4: CTA Strip

Same pattern as index.html CTA Banner. Headline: `"Come See the Space"`. CTA: "Apply to Rent a Booth" → apply.html.

---

### Section 5: Footer

See Section 1.3 Global Footer.

---

## 6. faq.html — SECTION ORDER

### Section 1: Page Header

**Layout:**
- Background: `--color-bg`
- Padding: `--space-8` top/bottom
- No background image — typographic header only
- Eyebrow: `"FAQ"` — standard style, centered
- Headline: `"Questions About Booth Rental"` — `--font-display`, 52px desktop / 32px mobile, centered
- Sub-copy: `"Everything you need to know before applying."` — `--font-body`, 17px, `--color-text-secondary`, centered

---

### Section 2: Accordion FAQ List

**Layout:**
- Background: `--color-bg`
- Max content width: 760px, centered
- Padding: `--space-4` (32px) top, `--space-10` (80px) bottom
- Each FAQ item: full-width, `border-bottom: 1px solid --color-border`
- First item also has `border-top: 1px solid --color-border`

**Markup pattern per item:**
```html
<div class="faq-item">
  <button
    class="faq-item__trigger"
    aria-expanded="false"
    aria-controls="faq-answer-1"
    id="faq-trigger-1"
  >
    <span class="faq-item__question">What is the weekly rental rate?</span>
    <span class="faq-item__icon" aria-hidden="true">+</span>
  </button>
  <div
    class="faq-item__answer"
    id="faq-answer-1"
    role="region"
    aria-labelledby="faq-trigger-1"
    hidden
  >
    <p>Answer text here.</p>
  </div>
</div>
```

**Interaction:**
- Click trigger: toggle `aria-expanded` between `true` / `false`, toggle `hidden` attribute on answer panel
- Icon: `+` rotates to `×` when open (CSS `transform: rotate(45deg)` on `.faq-item--open .faq-item__icon`)
- Keyboard: trigger is a `<button>`, so Enter and Space work natively
- Only one item open at a time (optional but preferred): closing the previously open item when a new one opens
- Animation: `max-height` transition from 0 to auto equivalent (use JS to set explicit px value), duration `--transition-base`

**Trigger styles:**
- Height: min 56px, `display: flex`, `justify-content: space-between`, `align-items: center`
- Question text: `--font-body`, 17px, `--color-text-primary`
- Icon: `--font-ui`, 22px, `--color-accent`
- On hover/focus: background tint `--color-surface`

**Answer styles:**
- Padding: `--space-3` left and bottom
- `--font-body`, 15px, `--color-text-secondary`, line-height 1.75

**Suggested FAQ items (8–10 items, placeholder):**
1. What is the weekly/monthly booth rental rate?
2. Do I need to bring my own equipment?
3. What are the salon's operating hours? Can I work evenings or weekends?
4. Do you offer salon suite (private room) rentals in addition to booth rentals?
5. Is there a lease commitment or can I rent month-to-month?
6. Do I keep 100% of my earnings?
7. Can I sell retail products from my station?
8. What licenses do I need to rent a booth in Indiana?
9. Is there a waitlist? How competitive is it to get a booth?
10. How do I apply?

---

### Section 3: CTA Banner at Bottom

Same pattern as index.html CTA Banner. Headline: `"Still Have Questions? Let's Talk."`. CTA: "Get in Touch" → contact.html. Secondary CTA text link: "Or apply directly →" → apply.html.

---

### Section 4: Footer

See Section 1.3 Global Footer.

---

## 7. contact.html — SECTION ORDER

### Section 1: Page Header with Context Copy

**Layout:**
- Background: `--color-bg`
- Padding: `--space-8` top/bottom
- No background image
- Eyebrow: `"CONTACT"` — standard style, centered
- Headline: `"Let's Talk"` — `--font-display`, 52px desktop / 32px mobile, centered
- Context copy: `"Have questions about our booth rental program? We're happy to chat before you apply."` — `--font-body`, 17px, `--color-text-secondary`, centered, max-width 520px

---

### Section 2: Contact Form

**Layout:**
- Background: `--color-bg`
- Max content width: 640px, centered
- Padding: 0 top (continuing from header section), `--space-9` bottom

**Fields:**

| Field | Type | Validation |
|---|---|---|
| Full Name | `<input type="text">` | Required |
| Email Address | `<input type="email">` | Required |
| Message | `<textarea>` | Required, minlength="20", min-height 160px |
| Submit | `<button type="submit">` | "Send Message" |

- Label above each field
- Fields: full-width, `--space-4` gap between
- Submit button: primary style, min-width 180px, min-height 48px

**Error + success:** Same pattern as apply.html errors. Success: inline confirmation message replaces submit button area.

---

### Section 3: Apply Link / Bridge

**Layout:**
- After form, before footer
- Background: `--color-surface`
- Padding: `--space-7` top/bottom
- Centered
- Headline (small): `"Ready to Apply?"` — `--font-ui`, 14px, uppercase, letter-spacing
- Body text: `"Skip the small talk and go straight to the application."` — `--font-body`, 16px, `--color-text-secondary`
- Button: "Apply to Rent a Booth" → apply.html — primary button style
- Full max-width layout, centered

---

### Section 4: Footer

See Section 1.3 Global Footer.

---

## 8. DESIGN TOKEN SUMMARY

All tokens defined as CSS custom properties on `:root`. Dark theme is the default.

### 8.1 Color Tokens

```css
:root {
  /* Core UI colors */
  --color-bg:               #0f0f0f;       /* Page background — near black */
  --color-surface:          #1a1a1a;       /* Card, nav, footer bg — slightly lighter */
  --color-text-primary:     #f0ece4;       /* Main body text — warm off-white */
  --color-text-secondary:   #8a8580;       /* Muted text, captions, labels */
  --color-border:           #2e2b28;       /* Dividers, input borders, card borders */
  --color-accent:           #c9a87c;       /* Primary brand accent — warm gold/bronze */

  /* Brand palette */
  --brand-brown:            #6b4c35;       /* Deep warm brown */
  --brand-offwhite:         #f5f0e8;       /* Cream / off-white for light text on dark */
  --brand-pink:             #d4a0a0;       /* Dusty rose / muted pink */
  --brand-green:            #7a9e7e;       /* Sage green */
  --brand-blue:             #6b8cae;       /* Muted slate blue */
  --brand-neutral:          #b0a99e;       /* Warm mid-tone neutral */
  --brand-turquoise:        #5f9ea0;       /* Deep turquoise / teal */

  /* State colors */
  --color-error:            #e53e3e;       /* Form error red */
  --color-success:          #38a169;       /* Form success green */
}
```

---

### 8.2 Typography Tokens

```css
:root {
  --font-ui:       "Courier New", Courier, "Lucida Console", monospace;
  --font-body:     Georgia, "Times New Roman", serif;
  --font-display:  "Playfair Display", Georgia, "Times New Roman", serif;
  /* Note: --font-display requires <link> to Google Fonts for Playfair Display,
     or swap for system serif if performance is priority */
}
```

**Typography scale guidance (not tokens — implemented directly in CSS):**
- Display / Hero: 80px desktop, 40px mobile (`--font-display`)
- Section headline: 40–52px desktop, 28–32px mobile (`--font-display`)
- Card/subsection headline: 18–24px (`--font-display` or `--font-ui`)
- Body copy: 15–18px (`--font-body`), line-height 1.7–1.8
- UI labels / eyebrows: 11–13px, uppercase, letter-spacing 0.08–0.14em (`--font-ui`)
- Input / form text: 16px minimum (mobile critical), `--font-body`

---

### 8.3 Spacing Scale (8px base)

```css
:root {
  --space-1:    8px;
  --space-2:   16px;
  --space-3:   24px;
  --space-4:   32px;
  --space-5:   40px;
  --space-6:   48px;
  --space-7:   56px;
  --space-8:   64px;
  --space-9:   72px;
  --space-10:  80px;
}
```

---

### 8.4 Border Radius

```css
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:  16px;
}
```

---

### 8.5 Transition

```css
:root {
  --transition-base: 200ms ease;
}
```

Usage: `transition: all var(--transition-base)` on interactive elements (buttons, links, inputs on focus, accordion panels). Do NOT use `transition: all` on elements with expensive CSS properties (e.g., box-shadow in a tight loop). Prefer explicit property targeting: `transition: background-color var(--transition-base), border-color var(--transition-base), opacity var(--transition-base)`.

---

### 8.6 Button Styles (derived from tokens — for Agent C reference)

**Primary button:**
```css
.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-bg);
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);   /* 16px 32px */
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  min-height: 48px;
  transition: background-color var(--transition-base), opacity var(--transition-base);
}
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
```

**Ghost/outline button:**
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  min-height: 48px;
  transition: border-color var(--transition-base), color var(--transition-base);
}
.btn-ghost:hover { border-color: var(--color-text-secondary); color: var(--color-text-primary); }
```

---

## 9. ACCESSIBILITY REQUIREMENTS (Global)

These apply across all pages and must be implemented by Agent C:

1. **Color contrast:** All text must meet WCAG AA. `--color-text-primary` on `--color-bg` and `--color-surface` must be verified. `--color-accent` on `--color-bg` for button text must meet 4.5:1.
2. **Focus indicators:** All interactive elements must have visible `:focus-visible` outline. Use `outline: 2px solid var(--color-accent); outline-offset: 3px;`. Remove default outline only when replacing with custom.
3. **Skip link:** First element in `<body>` on every page: `<a class="skip-link" href="#main-content">Skip to main content</a>`. Visually hidden until focused.
4. **Landmark regions:** `<nav>`, `<main id="main-content">`, `<footer>` on every page.
5. **Image alt text:** All `<img>` elements must have `alt`. Decorative images: `alt=""`.
6. **Form labels:** Every `<input>`, `<select>`, `<textarea>` must have an associated `<label>` via `for`/`id` pairing. No placeholder-only labels.
7. **Reduced motion:** Wrap all parallax JS and CSS transitions exceeding 200ms in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred, skip parallax entirely and use instant or very short transitions.

---

## 10. PERFORMANCE NOTES (Global)

1. **Parallax** is CSS `background-attachment: fixed` on hero images (desktop ≥ 1024px). On mobile, use `background-attachment: scroll`. Use a CSS media query — no JS required for basic parallax. If JS-driven parallax is needed for greater control, gate it behind `window.matchMedia("(min-width: 1024px)")` and the `prefers-reduced-motion` check.
2. **Images:** All hero/placeholder images should have `loading="lazy"` except the above-the-fold hero image on each page (use `loading="eager"` or no attribute on the first hero). Add explicit `width` and `height` attributes to prevent layout shift.
3. **Fonts:** If using Google Fonts for Playfair Display, add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `<head>`. Add `font-display: swap` in the font import.
4. **CSS file structure:** Single `styles.css` file for MVP. Agent C should organize with comments: `/* === TOKENS === */`, `/* === RESET === */`, `/* === GLOBAL === */`, `/* === NAV === */`, `/* === FOOTER === */`, `/* === [PAGE NAME] === */`.
5. **JS:** Minimal. Required JS: hamburger menu toggle, sticky nav class toggle, apply.html form stepper logic, FAQ accordion. No framework required. Vanilla JS only.

---

*End of WIREFRAMES_SPEC.md — Agent C implements directly from this document. No further clarification should be needed.*
