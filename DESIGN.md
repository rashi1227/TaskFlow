---
name: Enterprise Task Management System
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-page: 40px
---

## Brand & Style

This design system is engineered for high-performance B2B SaaS environments where clarity and cognitive efficiency are paramount. The aesthetic follows a **Modern Corporate Minimalism** philosophy, stripping away unnecessary ornamentation to prioritize task completion and data density without overwhelming the user.

The target audience consists of professional project managers and cross-functional teams who require a reliable, "quiet" interface that recedes into the background, allowing the work itself to take center stage. The emotional response is one of calm authority, institutional trust, and methodical organization. Every pixel is intentional, utilizing whitespace not just as a design choice, but as a functional tool to separate complex workstreams and reduce decision fatigue.

## Colors

The palette is anchored by a sophisticated hierarchy of blues and greys. The primary surface color is **#F8FAFC**, providing a soft, low-strain canvas that is more approachable than pure white. 

**Primary Navy (#1E293B)** is reserved for high-level navigation and primary actions, signaling stability and importance. **Soft Slate Blue (#64748B)** acts as the secondary accent, used for supporting icons, metadata, and inactive states to maintain a cohesive monochromatic feel. 

Functional colors for status (Success, Warning, Error) are desaturated slightly to align with the professional tone while remaining accessible. Contrast ratios are strictly maintained to ensure WCAG 2.1 compliance across all interactive elements.

## Typography

This design system utilizes **Inter** exclusively to take advantage of its exceptional legibility in digital interfaces and its neutral, utilitarian character. 

The typographic hierarchy is structured to guide the eye through complex task data. Headlines use tighter letter-spacing and heavier weights to create distinct anchors for the user. Body text uses a generous 1.5x to 1.6x line height to prevent "text heavy" fatigue during long work sessions. Small labels and captions are treated with intentional weight increases (Medium or Semi-Bold) to ensure readability at smaller scales, especially within data-dense tables and kanban cards.

## Layout & Spacing

The layout philosophy follows a **strict 8px / 4px baseline grid** to ensure mathematical harmony across all components. For enterprise dashboards, this design system employs a **Fluid-Fixed hybrid model**: navigation sidebars are fixed-width to provide a constant anchor, while the main content area utilizes a fluid grid that optimizes for high-resolution monitors.

Padding within cards and containers is generous (typically 24px) to promote the "Minimalist" feel, ensuring that data points do not feel crowded. Gutters are kept at a consistent 20px to allow for clear vertical scanning of task lists and columns.

## Elevation & Depth

Depth in this design system is communicated through **Tonal Layering** and **Ambient Shadows** rather than heavy gradients. 

1.  **Level 0 (Canvas):** The #F8FAFC background.
2.  **Level 1 (Surfaces):** Pure white cards and containers. These are defined by a 1px solid border in #E2E8F0.
3.  **Level 2 (Interaction):** Upon hover or selection, cards receive a subtle, diffused shadow: `0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)`.
4.  **Level 3 (Overlay):** Modals and dropdowns use a slightly more pronounced shadow with a hint of navy tinting to create clear separation from the workspace.

Shadows must always be desaturated and highly blurred to maintain the "trustworthy and professional" mood.

## Shapes

To maintain a professional and structured appearance, this design system uses a **Soft (Level 1)** roundedness profile. Standard UI elements like buttons, input fields, and small cards utilize a 4px (0.25rem) corner radius. 

Larger containers and main dashboard cards may use up to 8px (0.5rem) to soften the overall interface slightly without appearing overly casual. This geometric precision reinforces the "Enterprise" nature of the tool, conveying a sense of order and reliability.

## Components

### Buttons
Primary CTAs are solid **Navy (#1E293B)** with white text, providing an unambiguous focal point. Secondary buttons use a ghost style with a Slate Blue border and text. All buttons feature a 150ms ease-in-out transition on hover, where the background subtly darkens.

### Cards
Cards are the primary vehicle for tasks. They must feature a white background, a 1px #E2E8F0 border, and no shadow in their default state. On hover, the shadow appears to signal interactivity. Padding inside cards is standardized at 16px for small items and 24px for large items.

### Input Fields
Inputs are minimalist: a 1px grey border that transitions to Navy Blue on focus. Labels are always positioned above the field in a bold, 12px font for maximum clarity.

### Chips & Tags
Used for task status and priority. These use a "Soft Background" approach—very desaturated versions of the status colors with high-contrast text (e.g., a very light green background with dark green text) to ensure they are visible but not distracting.

### Lists & Tables
Enterprise task management relies on lists. Rows should have a subtle #F8FAFC hover state and a clear 1px bottom divider. Cell padding should be vertical-centric to allow for "breathable" data scanning.