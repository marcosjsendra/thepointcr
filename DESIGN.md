---
name: The Point
description: Brochure website for a Liberia printshop, signage, and design studio.
colors:
  ink-black: "#000000"
  paper-white: "#ffffff"
  print-cyan: "#00d1ff"
  print-magenta: "#ff00c7"
  print-yellow: "#fff500"
  graphite: "#585858"
  soft-gray: "#dddddd"
typography:
  display:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 6.25rem)"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "normal"
  headline:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 900
    lineHeight: 1
  body:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  input: "4px"
  media: "9px"
  dialog: "10px"
spacing:
  xs: "5px"
  sm: "10px"
  md: "20px"
  lg: "40px"
  xl: "90px"
components:
  button-primary:
    backgroundColor: "{colors.print-magenta}"
    textColor: "{colors.paper-white}"
    rounded: "0"
    padding: "12px 30px"
  button-yellow:
    backgroundColor: "{colors.print-yellow}"
    textColor: "{colors.ink-black}"
    rounded: "0"
    padding: "12px 30px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "0"
    padding: "12px 30px"
  input-dark:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.input}"
    height: "50px"
---

# Design System: The Point

## 1. Overview

**Creative North Star: "Printshop Signal"**

The Point design system is built from production graphics: black fields, white type, sharp CMY accents, and real work imagery. It should feel direct and made, not airy or decorative. The current Webflow-era identity is intentionally bold, with oversized Montserrat headlines and color bars that reference print registration.

The system rejects generic SaaS polish, pastel startup softness, and a redesign that erases the cyan, magenta, and yellow print vocabulary. Refinement should make the site easier to read, faster to navigate, and more reliable to submit without making it feel like a different company.

**Key Characteristics:**

- Black and white dominate the experience.
- Cyan, magenta, and yellow appear as decisive print accents.
- Headlines are heavy, compact, and direct.
- Photography shows finished signage, print pieces, and installation work.
- Buttons and fields are simple rectangles with minimal radius.

## 2. Colors

The palette is a high-contrast print palette: black and white carry the layout, while cyan, magenta, and yellow provide the identity.

### Primary
- **Ink Black**: The default dark field for hero, footer, overlays, and high-contrast sections.
- **Paper White**: Primary text on dark fields and the main neutral surface for content bands.

### Secondary
- **Print Magenta**: Primary call-to-action color and one of the three brand registration accents.
- **Print Yellow**: Secondary call-to-action color on the "Que hacemos" page and newsletter moments.
- **Print Cyan**: Brand registration accent and supporting color for color bars and highlight moments.

### Neutral
- **Graphite**: Supporting dividers, muted bars, and low-emphasis UI.
- **Soft Gray**: Legacy Webflow utility neutral. Use sparingly for defaults, never as a major brand surface.

### Named Rules

**The CMY Signal Rule.** Cyan, magenta, and yellow must feel like printshop identity, not random decoration. Use them in bars, CTAs, and high-signal details.

**The Black Field Rule.** Hero and footer experiences stay dark. Do not turn the site into a pale brochure.

## 3. Typography

**Display Font:** Montserrat with Arial and sans-serif fallbacks
**Body Font:** Montserrat with Arial and sans-serif fallbacks

**Character:** A single-family system keeps the site blunt and graphic. Weight contrast does the work: heavy display text for service positioning, compact body text for service detail and form guidance.

### Hierarchy
- **Display** (900, fluid 52px to 100px, tight line-height): Hero statements and major campaign words only.
- **Headline** (900, 32px to 64px, tight line-height): Section titles and footer calls to action.
- **Title** (700 to 900, 18px to 36px): Product names, popup titles, and compact service blocks.
- **Body** (400 to 500, 14px to 18px): Service descriptions, product specs, form helper text, and privacy copy.
- **Label** (700, 12px to 14px): Footer labels, short metadata, and compact navigation labels.

### Named Rules

**The Heavy Headline Rule.** Keep the large Montserrat display voice. Improve wrapping and responsive sizing before changing type personality.

## 4. Elevation

The system is mostly flat. Depth comes from dark overlays, full-bleed imagery, and strong contrast rather than decorative shadows. Popups may sit above a translucent black overlay, but buttons and product blocks should not gain soft SaaS shadows.

### Named Rules

**The Flat Print Rule.** Surfaces are flat unless a modal overlay requires depth. No decorative card shadows.

## 5. Components

### Buttons
- **Shape:** Rectangular with square corners or minimal inherited radius.
- **Primary:** Print Magenta background with white text.
- **Yellow:** Print Yellow background with black text for the "Que hacemos" CTA language.
- **Ghost:** Transparent background with white or black border depending on the section.
- **Hover / Focus:** Invert to white or black where appropriate. Always keep a visible focus outline.

### Cards / Containers
- **Corner Style:** Product media can use soft 9px corners; most layout blocks remain square.
- **Background:** Product and portfolio blocks rely on real imagery with black overlays.
- **Shadow Strategy:** No ambient card shadows.
- **Internal Padding:** Tight-to-medium spacing, usually 20px to 40px.

### Inputs / Fields
- **Style:** Transparent fields on dark backgrounds, 1px white border, 4px radius, 50px height.
- **Focus:** White text remains visible, border/focus ring becomes CMY-accented.
- **Error / Disabled:** Error text should be explicit and readable on black.

### Navigation
- **Style:** Logo left, compact links right, white text over the dark hero. Mobile navigation collapses into a black panel and should be keyboard-operable.

### Product Popup
- **Style:** White modal with product image on the left, product specs on the right, black title rule, and a WhatsApp CTA. It must open from product cards and close by button, Escape, overlay click, or keyboard focus flow.

## 6. Do's and Don'ts

### Do:
- **Do** keep black, white, cyan, magenta, and yellow as the identity core.
- **Do** use real work imagery for products, services, and portfolio proof.
- **Do** keep form interactions direct, with clear success and error states.
- **Do** improve mobile spacing and text wrapping before changing visual direction.
- **Do** preserve the bold Montserrat headline voice.

### Don't:
- **Don't** make this look like a generic SaaS landing page.
- **Don't** use soft pastel startup visuals.
- **Don't** add heavy glassmorphism or decorative shadows.
- **Don't** replace the printshop identity with stock-photo brochure sameness.
- **Don't** turn product blocks into ecommerce checkout cards.
