---
name: Warm Editorial Cultural
colors:
  surface: '#fbf8fe'
  surface-dim: '#dcd9de'
  surface-bright: '#fbf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f8'
  surface-container: '#f0edf2'
  surface-container-high: '#eae7ed'
  surface-container-highest: '#e4e1e7'
  on-surface: '#1b1b1f'
  on-surface-variant: '#59413b'
  inverse-surface: '#303034'
  inverse-on-surface: '#f3f0f5'
  outline: '#8d7169'
  outline-variant: '#e1bfb6'
  surface-tint: '#ac340c'
  primary: '#a93109'
  on-primary: '#ffffff'
  primary-container: '#cb4922'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb5a0'
  secondary: '#3a6758'
  on-secondary: '#ffffff'
  secondary-container: '#b9ead7'
  on-secondary-container: '#3e6b5c'
  tertiary: '#785600'
  on-tertiary: '#ffffff'
  tertiary-container: '#976d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#872100'
  secondary-fixed: '#bcedda'
  secondary-fixed-dim: '#a1d1be'
  on-secondary-fixed: '#002118'
  on-secondary-fixed-variant: '#214f41'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#f9bd39'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#fbf8fe'
  on-background: '#1b1b1f'
  surface-variant: '#e4e1e7'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  title-md:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the warmth, poise, and tactile curation of a premier cultural program or independent arts festival. It steps deliberately away from cold, mechanical SaaS tropes in favor of an editorial voice that treats event creation and ticket distribution as cultural curation. The aesthetic blends mid-century print authority with responsive digital ergonomics.

The visual tone is defined by rich organic pigment, structured layouts, and deliberate whitespace. Micro-interactions should feel tactile and weighted rather than ephemeral—resembling the satisfying transition of heavy card stock and stamped archival paper. The interface engenders trust, creative autonomy, and anticipation for live experiences.

## Colors

The palette draws directly from natural pigments: terracotta earthenware, dense woodland evergreen, and aged botanical paper.

### Palette Architecture
- **Primary (`#D9532B` - Terracotta):** High-intent conversions, focal interactive states, primary actions, and key identity anchors.
- **Secondary (`#1F4D3F` - Forest Green):** Structural surfaces such as persistent sidebars, top banners, navigation headers, and anchoring elements.
- **Tertiary (`#F2B632` - Sunflower):** Informational highlights, featured status pills, and celebratory accents.
- **Neutral Base:**
  - Canvas Background: `#FAF6F0` (warm off-white / parchment)
  - Card & Container Surface: `#FFFFFF`
  - Structural Division / Border: `#E8DFD3`
  - Primary Typography: `#1B1B1F` (deep ink)
  - Secondary Typography & Subtle Metadata: `#6B6258` (muted stone)

### State Tokens
- **Draft:** `#9A9186`
- **Published / Confirmed:** `#2E7D5B`
- **Cancelled / Destructive:** `#B3382C`
- **Pending / Attention:** `#D9922B`

## Typography

The typographic hierarchy bridges classical broadsheet publishing with contemporary product efficiency:

- **Headings (Newsreader):** Brings literary warmth, pronounced optical contrast, and an air of traditional event program design. Used across page hero blocks, event titles, and section landmarks. Apply italic styles sparingly for dates, curatorial statements, or location tags.
- **Body & Controls (DM Sans):** Delivers clean geometry, exceptional legibility at small sizes, and modern utility. It grounds dense informational layouts, data tables, checkout flows, and operational dashboards without competing with the editorial headings.

## Layout & Spacing

The layout is built on a responsive 12-column system configured with deliberate breathing room to reinforce the feeling of an unhurried cultural brochure:

- **Desktop (1200px+):** 12 columns, `gutter` of 1.5rem (24px), page `margin` of 2.5rem (40px). Max content container: 1360px.
- **Tablet (768px - 1199px):** 8 columns, `gutter` of 1.25rem (20px), page `margin` of 2rem (32px).
- **Mobile (< 768px):** 4 columns, `gutter-sm` of 1rem (16px), page `margin-sm` of 1.25rem (20px).

Elements adhere to an 8px base rhythmic baseline (`space-xs` through `space-xl`). Sections must prioritize vertical whitespace around editorial headings to prevent the visual fatigue common to dense operational tools.

## Elevation & Depth

Visual separation relies primarily on crisp structural boundaries rather than deep artificial drop shadows:

- **Borders over Shadows:** Surfaces use a consistent 1px solid border (`#E8DFD3`) resting upon the `#FAF6F0` foundation to define panels, tables, and cards.
- **Soft Ambient Elevation:** When an element requires lift (such as an active modal, floating command bar, or hovered event ticket), use a diffused warm-tinted shadow:
  - Base Card: `box-shadow: 0 1px 3px rgba(27, 27, 31, 0.04);`
  - Interactive Hover: `box-shadow: 0 8px 24px -4px rgba(31, 77, 63, 0.08), 0 2px 6px -1px rgba(27, 27, 31, 0.03);`
  - Popovers / Overlays: `box-shadow: 0 16px 36px -8px rgba(27, 27, 31, 0.12);`
- **Depth Stacking:** Dark forest green surfaces (`#1F4D3F`) serve as grounding structural anchors (navigation ribbons, side rails) that sit behind and frame warm white cards.

## Shapes

The design system employs moderate, friendly rounded corners calibrated at 10px–12px (`roundedness: 2`). This avoids the hyper-sleek pill aesthetic while preventing severe hard edges, supporting the approachable, artisanal ethos of the platform.

- **Cards, Panels & Large Containers:** `12px` (corresponds to `rounded-lg`).
- **Interactive Buttons, Inputs & Dropdowns:** `10px` (corresponds to baseline shape token).
- **Tags, Badges & Micro-Pills:** `6px` to maintain geometry at diminutive scales.
- **Media Containers (Event Covers, Artist Stills):** `10px` inner mask with an exterior `1px` border overlay.

## Components

### Buttons
- **Primary:** Solid terracotta (`#D9532B`) with `#FFFFFF` text. Flat state, expanding softly on hover (`#C44722`). Border-radius: 10px; height: 44px; padding: 0 20px.
- **Secondary:** Transparent fill, 1px border `#E8DFD3`, `#1B1B1F` text. Hovers to `#FAF6F0` with a deepened border `#D0C5B6`.
- **Tertiary / Forest Variant:** Solid `#1F4D3F` with white typography for executive actions (e.g., "Publish Event", "Export Manifest").

### Cards & Ticket Modules
- Constructed on a pure white `#FFFFFF` surface bounded by a 1px `#E8DFD3` border.
- Event management cards should feature a distinctive dual-panel ticket layout: an editorial left zone (date, time, primary Newsreader title) and a right operational rail separated by a dotted or notched vertical rule.

### Input Fields & Controls
- **Text Inputs:** Height 44px, background `#FFFFFF`, border 1px solid `#E8DFD3`, text `#1B1B1F`. Placeholder text `#6B6258` at 60% opacity. Focused state transitions border to `#1F4D3F` with a soft outline `0 0 0 3px rgba(31, 77, 63, 0.12)`.
- **Checkboxes & Radios:** 18px dimensions with `#E8DFD3` border. Active state fills with `#1F4D3F` and displays a crisp white indicator mark.

### Chips, Status Badges & Pills
- Status tags feature a muted background (10% tint of the respective state token) coupled with solid text:
  - **Published / Confirmed:** `#EBF5F0` background with `#2E7D5B` typography.
  - **Pending / Action Needed:** `#FAF3E5` background with `#D9922B` typography.
  - **Cancelled:** `#FDF0EE` background with `#B3382C` typography.
  - **Highlight / Featured Tag:** Sunflower `#F2B632` background with `#1B1B1F` bold label styling.

### Lists & Data Tables
- Table header row uses a muted fill `#FAF6F0` with `#6B6258` uppercase label-sm typography.
- Row items transition to `#FAF6F0` on hover, delimited with 1px horizontal strokes (`#E8DFD3`). No vertical column dividers.