# Design System Inspired by Behance

## 1. Visual Theme & Atmosphere

This design system embodies a clean, professional creative platform aesthetic centered on showcasing digital work in a distraction-free environment. The visual language prioritizes content discovery and creator profiles with a sophisticated dark-to-light contrast strategy, employing deep neutrals as the foundational canvas and vibrant blue as the actionable focal point. The typography is precise and hierarchical, supporting both scanning and deep content engagement. The overall atmosphere is gallery-like yet contemporary, balancing minimalist restraint with strategic color pops that guide user attention toward key interactions and premium features.

**Key Characteristics**
- Dark neutral foundation (`#191919` base) with white content areas creating stark contrast
- Bold primary blue (`#0057FF`) reserved exclusively for high-intent actions and trust signals
- Refined typography hierarchy using single font family across all scales
- Abundant whitespace and breathing room around content blocks
- Soft, fully-rounded pill buttons for primary actions
- Minimal shadows and zero-border aesthetic for flat, modern feel
- Professional grey palette (`#707070`, `#959595`) for secondary text and disabled states

## 2. Color Palette & Roles

### Primary
- **Primary Action Blue** (`#0057FF`): Primary buttons, links, follow/hire CTAs, interactive states; establishes brand trust and drives conversions

### Accent Colors
- **Light Blue Tint** (`#E0EAFF`): Button backgrounds for subtle, secondary emphasis; hover states and disabled backgrounds

### Interactive
- **Interactive Text** (`#0057FF`): Default link color; icon tint for interactive elements
- **Dark Interactive** (`#191919`): Primary text for navigation, labels, and interactive component text

### Neutral Scale
- **Foreground Black** (`#000000`): Deepest text for critical information hierarchy; high-contrast overlays
- **Primary Grey Dark** (`#191919`): Primary text, headings, navigation items; dominant UI text color
- **Medium Grey** (`#707070`): Secondary body text, metadata, timestamps, breadcrumbs
- **Light Grey** (`#959595`): Tertiary text, disabled states, helper text
- **Very Light Grey** (`#696969`): Subtle dividers, muted context
- **Pale Grey** (`#3C3C3C`): Subtle backgrounds, container distinctions

### Surface & Borders
- **Pure White** (`#FFFFFF`): Primary surface, cards, overlays, content backgrounds
- **Very Light Surface** (`#E8E8E8`): Secondary surface backgrounds; input fields; subtle container differentiation

### Semantic / Status
- **Error Red** (`#D00D00`): Error messages, validation failures, destructive actions; high visibility for critical feedback

## 3. Typography Rules

### Font Family
**Primary:** `acumin-pro`, `'Segoe UI'`, `Tahoma`, sans-serif
**Secondary:** `acumin-pro` (same family; weight variation provides hierarchy)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | acumin-pro | 28px | 700 | 34.4px | 0px | Large page titles, hero headlines |
| Heading / H2 | acumin-pro | 18px | 700 | 22px | 0px | Section headers, modal titles |
| Subheading / H6 | acumin-pro | 16px | 600 | 20.8px | 0px | Feature titles, card headers |
| Body Large | acumin-pro | 16px | 600 | 20.8px | 0px | Primary body text, descriptions |
| Body | acumin-pro | 14px | 600 | 18.2px | 0px | Default body copy, component text |
| Button / Label | acumin-pro | 12px | 400 | 15.6px | 0px | Navigation items, button text |
| Caption / Small | acumin-pro | 12px | 400 | 15.6px | 0px | Metadata, helper text, footnotes |
| Micro / H2 Mini | acumin-pro | 11px | 700 | 11px | 0px | Tags, badges, mini labels |
| Input | acumin-pro | 15px | 600 | normal | 0px | Form inputs, search fields |

### Principles
- **Weight-driven hierarchy:** Font weight (700 → 600 → 400) carries more cognitive load than size alone, reducing visual clutter
- **Consistent leading:** Line heights maintain 1.2–1.3× size ratio for readability across scales
- **Single-family system:** `acumin-pro` provides professional neutrality; weight and size shifts drive distinction
- **Tight tracking:** Zero letter spacing preserves modern, compact aesthetic; full text remains legible at all sizes

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#0057FF`
- Text color: `#FFFFFF`
- Font size: `14px`
- Font weight: `600`
- Font family: `acumin-pro`
- Padding: `8px 20px`
- Height: `40px`
- Border radius: `100px`
- Border: `none`
- Box shadow: `none`
- Hover state: Background `#0047D6` (darken 5%), text `#FFFFFF`
- Active state: Background `#003BA8` (darken 10%), text `#FFFFFF`
- Disabled state: Background `#E0EAFF`, text `#959595`, cursor `not-allowed`

**Secondary Button**
- Background: `#E0EAFF`
- Text color: `#0057FF`
- Font size: `14px`
- Font weight: `600`
- Font family: `acumin-pro`
- Padding: `8px 20px`
- Height: `40px`
- Border radius: `100px`
- Border: `1px solid #E0EAFF`
- Box shadow: `none`
- Hover state: Background `#D0DCFF`, border `#D0DCFF`, text `#0057FF`
- Active state: Background `#C0CEFF`, border `#C0CEFF`, text `#0047D6`
- Disabled state: Background `#F5F8FF`, text `#959595`, cursor `not-allowed`

**Ghost Button**
- Background: `transparent`
- Text color: `#191919`
- Font size: `12px`
- Font weight: `400`
- Font family: `acumin-pro`
- Padding: `0px 16px`
- Height: `auto`
- Border radius: `0px`
- Border: `none`
- Box shadow: `none`
- Hover state: Text color `#0057FF`, background `transparent`
- Active state: Text color `#0047D6`
- Disabled state: Text color `#959595`, cursor `not-allowed`

### Cards & Containers

**Profile Card**
- Background: `#FFFFFF`
- Border: `none`
- Border radius: `6px`
- Padding: `20px`
- Box shadow: `0px 2px 8px rgba(0, 0, 0, 0.08)`
- Heading (h6): `#191919`, `16px`, `600`, line-height `20.8px`
- Body text: `#707070`, `14px`, `600`, line-height `18.2px`

**Content Card**
- Background: `#F5F8FF` (light blue tint area) or `#FFFFFF` (white)
- Border: `1px solid #E8E8E8`
- Border radius: `4px`
- Padding: `16px`
- Box shadow: `none`
- Image container radius: `4px`
- Hover state: Border `#D0DCFF`, shadow `0px 4px 12px rgba(0, 87, 255, 0.1)`

**Container / Section**
- Background: `#FFFFFF`
- Padding: `40px` (desktop), `24px` (tablet), `16px` (mobile)
- Border: `none`
- Max width: `1440px` (centered on page)
- Margin: `0 auto`

### Inputs & Forms

**Text Input**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border radius: `4px`
- Font size: `15px`
- Font weight: `600`
- Font family: `acumin-pro`
- Text color: `#191919`
- Padding: `12px 16px`
- Height: `44px`
- Placeholder color: `#959595`
- Focus state: Border `#0057FF`, box-shadow `0px 0px 0px 3px rgba(0, 87, 255, 0.1)`
- Error state: Border `#D00D00`, background `#FFF5F5`
- Disabled state: Background `#F5F5F5`, border `#E8E8E8`, text color `#959595`, cursor `not-allowed`

**Search Input (large)**
- Background: `rgba(100, 100, 100, 0.15)` (semi-transparent grey overlay)
- Border: `none`
- Border radius: `4px`
- Font size: `15px`
- Font weight: `600`
- Font family: `acumin-pro`
- Text color: `#FFFFFF`
- Padding: `12px 16px`
- Height: `44px`
- Placeholder color: `rgba(255, 255, 255, 0.6)`
- Focus state: Background `rgba(100, 100, 100, 0.25)`, box-shadow `0px 0px 0px 3px rgba(0, 87, 255, 0.2)`

### Navigation

**Top Navigation Bar**
- Background: `#191919`
- Height: `64px`
- Padding: `0px 40px`
- Display: `flex`
- Align items: `center`
- Justify content: `space-between`

**Navigation Link**
- Font size: `12px`
- Font weight: `400`
- Font family: `acumin-pro`
- Text color: `#FFFFFF`
- Padding: `0px 16px`
- Height: `auto`
- Border radius: `0px`
- Border: `none`
- Hover state: Text color `#0057FF`
- Active state: Text color `#0057FF`, border-bottom `2px solid #0057FF`

**Navigation Logo**
- Font size: `16px`
- Font weight: `700`
- Font family: `acumin-pro`
- Text color: `#FFFFFF`
- Height: `32px`
- Display: `flex`
- Align items: `center`

### Badges & Tags

**Badge (Primary)**
- Background: `#E0EAFF`
- Text color: `#0057FF`
- Font size: `11px`
- Font weight: `700`
- Font family: `acumin-pro`
- Padding: `4px 12px`
- Border radius: `100px`
- Border: `none`
- Display: `inline-block`

**Badge (Secondary)**
- Background: `#F5F5F5`
- Text color: `#191919`
- Font size: `11px`
- Font weight: `700`
- Font family: `acumin-pro`
- Padding: `4px 12px`
- Border radius: `100px`
- Border: `1px solid #E8E8E8`

### Avatars

**Avatar Circle**
- Width: `48px`
- Height: `48px`
- Border radius: `50%`
- Border: `2px solid #FFFFFF`
- Background: `#E8E8E8` (placeholder)
- Object fit: `cover`
- Hover state: Border `#0057FF`

## 5. Layout Principles

### Spacing System
**Base unit:** `4px`

**Scale:** `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 52px, 56px, 76px, 84px`

**Usage contexts:**
- `4px`: Micro spacing within components (icon-to-text gap, badge padding)
- `8px`: Tight spacing (adjacent button pairs, form row gaps)
- `12px`: Component internal padding (small cards, inputs)
- `16px`: Standard padding (cards, containers, form fields)
- `20px`: Section margins, profile card content
- `24px`: Medium spacing between sections, mobile padding
- `32px`: Large section spacing, sidebar padding
- `40px`: Desktop section padding, major layout breaks
- `52px+`: Hero spacing, full-screen section margins

### Grid & Container
- **Max width:** `1440px` (full content area)
- **Desktop padding:** `40px` left/right (creates max-width constraint on large screens)
- **Tablet padding:** `24px` left/right
- **Mobile padding:** `16px` left/right
- **Column strategy:** Flexible grid; portfolio items adapt from 3-column (desktop) → 2-column (tablet) → 1-column (mobile)
- **Section pattern:** Alternating white backgrounds with subtle grey (`#F5F5F5`) accents; cards sit 16px apart

### Whitespace Philosophy
Generous whitespace surrounds all content blocks. Primary content occupies 60–70% of viewport width on desktop; remaining space creates visual breathing room and reduces cognitive load. Vertical rhythm strictly follows the 4px base unit, ensuring consistent visual cadence across all page sections. Negative space is an active design element, not merely absence of content.

### Border Radius Scale
- `0px`: Form inputs, navigation items, text buttons; preserves sharp, professional edge
- `4px`: Card images, small containers, content blocks
- `6px`: Medium card corners, tooltip containers
- `100px`: Pill buttons, badge containers, circular call-to-action elements
- `50%`: Perfect circles (avatars, circular badges)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | `box-shadow: none` | Text buttons, links, ghost buttons, navigation |
| Raised (1) | `box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08)` | Profile cards, content cards at rest |
| Floating (2) | `box-shadow: 0px 4px 12px rgba(0, 87, 255, 0.1)` | Hovered cards, modals, dropdowns |
| Elevated (3) | `box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15)` | Modal dialogs, full-screen overlays |
| High (4) | `box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.2)` | Top-level notifications, fixed headers on scroll |

**Shadow Philosophy:** Shadows are subtle and color-neutral for levels 0–1, transitioning to blue-tinted shadows at interactive hover states to reinforce the primary color system. Elevation creates visual hierarchy without heavy visual weight; the flat aesthetic is preserved through minimal shadow deployment. Shadows only appear on interactive or transitional states, preventing visual clutter in static compositions.

## 7. Do's and Don'ts

### Do
- Use `#0057FF` primary blue exclusively for primary CTAs, follow buttons, and high-intent links
- Apply full `100px` border radius to all primary action buttons (Follow, Hire, Start Free Trial)
- Maintain strict 4px baseline grid for all spacing; ensure all margin/padding values are multiples of 4px
- Use `acumin-pro` across all text; weight shifts (400 → 600 → 700) drive visual hierarchy
- Keep backgrounds either pure white (`#FFFFFF`) or `#191919` for sections; avoid mid-tone greys as backgrounds
- Preserve ample whitespace around profile cards and portfolio items; minimum 16px gap between adjacent containers
- Use `#707070` for secondary body text and metadata; never use black (`#000000`) for body copy
- Apply subtle shadows only on hover and interactive states; default state shadows are minimal or absent
- Fully round pill-button corners (`100px`) for primary and secondary button variants
- Reserve `#D00D00` error red exclusively for validation feedback and destructive actions

### Don't
- Don't apply gradients; system uses flat, solid colors throughout
- Don't use colors outside the defined palette; no custom oranges, purples, or greens
- Don't mix font families; `acumin-pro` is the single font system
- Don't exceed 3 font sizes in a single section (maintain visual simplicity)
- Don't place text directly on image; always use overlays with `rgba(0, 0, 0, 0.5)` or white card containers
- Don't apply borders to primary buttons; use solid background fills instead
- Don't round corners on text inputs or navigation components (`border-radius: 0px`)
- Don't use box shadows for primary visual separation; rely on borders (`#E8E8E8`) instead
- Don't apply color to secondary ghost buttons beyond text; backgrounds remain transparent
- Don't add letter-spacing to typography; maintain default tight tracking for modern feel
- Don't exceed `1440px` max width; content should never stretch full viewport

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–767px | Single-column layout, 16px padding, 12px font minimum, stacked buttons (full width) |
| Tablet | 768px–1023px | Two-column grid, 24px padding, 14px minimum font, buttons 50% width |
| Desktop | 1024px–1439px | Three-column portfolio grid, 32px padding, full typography scale active |
| Large Desktop | 1440px+ | Max-width constraint at 1440px, centered with outer padding, fixed sidebar layouts |

### Touch Targets
- **Minimum height:** `44px` for all interactive elements (buttons, inputs, links)
- **Minimum width:** `48px` for touch buttons on mobile
- **Spacing:** Minimum `8px` gap between adjacent interactive elements to prevent accidental taps
- **Avatar size:** `48px` on mobile, `56px` on desktop; never smaller than `36px`
- **Tap feedback:** Visual state change (color shift or slight scale) within `100ms` of touch

### Collapsing Strategy
- **Navigation:** Hamburger menu on devices below `768px`; horizontal navigation on tablet+
- **Portfolio grid:** 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop+)
- **Profile card:** Full width on mobile with vertical stacking; 50% width on tablet; fixed sidebar on desktop
- **Padding collapse:** `40px` (desktop) → `24px` (tablet) → `16px` (mobile)
- **Font scaling:** No font-size reduction below `12px`; maintain readability at mobile scale
- **Buttons:** Full width (`width: 100%`) on mobile, auto-width (`width: min-content`) on tablet+
- **Modals:** Full viewport height on mobile, centered box on tablet+, max-width `600px`

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Primary Action Blue (`#0057FF`)
- **Button backgrounds:** Secondary or light backgrounds `#E0EAFF`
- **Primary text:** `#191919` (dark grey)
- **Secondary text:** `#707070` (medium grey)
- **Disabled/tertiary:** `#959595` (light grey)
- **Backgrounds:** `#FFFFFF` (primary), `#191919` (dark sections), `#F5F5F5` (subtle accent)
- **Borders:** `#E8E8E8` (light grey line)
- **Accent/Hover:** `#0057FF` (blue)
- **Error:** `#D00D00` (red)
- **Heading text:** `#191919` with weight `600`–`700`

### Iteration Guide

1. **Button styling:** All primary CTAs use full `100px` border-radius, `#0057FF` background, `#FFFFFF` text, `8px 20px` padding, `40px` height. Secondary buttons swap background (`#E0EAFF`) and text (`#0057FF`) while maintaining radius and padding.

2. **Typography baseline:** Single font `acumin-pro` across all text; hierarchy driven by weight (700 bold, 600 semi-bold, 400 regular) and size (11px–28px). Line height remains 1.2–1.3× of font size. Zero letter-spacing throughout.

3. **Spacing strictness:** All margin and padding values must be multiples of `4px`. Standard section padding is `40px` desktop, `24px` tablet, `16px` mobile. Cards maintain `16px` internal padding; gaps between cards are `16px` minimum.

4. **Color constraint:** Use only the 11 defined colors. `#0057FF` is reserved for primary interactions only. `#191919` is primary text; `#707070` is secondary body. Avoid custom shades; always reference hex directly.

5. **Shadow deployment:** Minimal shadows—flat aesthetic preferred. Apply subtle shadows (`0px 2px 8px rgba(0, 0, 0, 0.08)`) only to resting cards. Hover states get slightly stronger shadows (`0px 4px 12px rgba(0, 87, 255, 0.1)`). Navigation and text buttons have zero shadow.

6. **Border radius consistency:** Buttons and badges use `100px` (full pill). Card images use `4px`. Inputs and navigation use `0px`. Avatars use `50%`. Never deviate from these rules.

7. **Layout max-width:** All content constrained to `1440px` max-width, centered on viewport with `40px` outer padding on desktop. Collapse padding to `24px` (tablet) then `16px` (mobile) while maintaining max-width until mobile breakpoint.

8. **Touch accessibility:** All interactive elements minimum `44px` height on touch devices. Button text remains readable at minimum `12px` font size. Ensure `8px` minimum gap between tap targets.

9. **Grid responsiveness:** Desktop: 3-column portfolio grid. Tablet: 2-column. Mobile: 1-column full-width. Adjust container widths proportionally; never shrink below `320px` on mobile.

10. **Focus and hover states:** Text buttons darken on hover (`#0047D6` for primary). Ghost buttons text color shifts to `#0057FF`. Inputs gain blue focus ring (`0px 0px 0px 3px rgba(0, 87, 255, 0.1)`). Maintain visual feedback within `100ms`.