---
name: Academic Horizon
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#6a5f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#bbac47'
  on-tertiary-container: '#484000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#f5e479'
  tertiary-fixed-dim: '#d8c860'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#504700'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-border: '#E2E8F0'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  accent-soft: '#F1F5F9'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  stats-number:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter-mobile: 16px
  gutter-desktop: 24px
  container-max: 1280px
  section-gap: 64px
---

## Brand & Style

This design system is engineered for the scholarly environment, balancing the gravity of academic research with modern digital accessibility. It targets students, faculty, and international researchers who require a high-trust, efficient interface for data discovery.

The design style is **Modern Minimalism** with a focus on high information density. It utilizes a structured, grid-based approach to ensure that complex research data remains legible. The aesthetic avoids unnecessary ornamentation, relying instead on precise typography, subtle depth through tonal layering, and generous whitespace to create a calm, focused intellectual environment.

## Colors

The palette is anchored by **Deep Navy (#1A365D)**, a color synonymous with institutional authority and academic excellence. This is supported by a professional **Slate Secondary**, used for utility elements and icons to prevent visual fatigue. **Muted Gold** is reserved for high-value tertiary accents, such as "Featured" research tags or achievement milestones in statistics.

The background uses a "Cool Gray" neutral to reduce glare during long reading sessions, while text adheres to a high-contrast near-black for maximum legibility and WCAG 2.1 compliance.

## Typography

The system utilizes **Inter** across all roles to ensure a neutral, highly-legible character across diverse languages and technical notations. 

- **Hierarchy**: Clear distinction is made between "Display" (Hero) and "Headline" (Section titles) through weight and negative letter-spacing.
- **Scale**: A modular scale ensures that data tables remain compact (`body-md`) while statistical callouts are prominent (`stats-number`).
- **Readability**: Line heights are intentionally generous (1.5x for body text) to accommodate dense academic abstracts.

## Layout & Spacing

The layout follows a **Fixed Grid** model for the central content container to ensure readability on large monitors, while implementing a **Fluid Bleed** for the Hero and Footer sections.

- **Grid**: A 12-column system is used for desktop, collapsing to a single column for mobile.
- **Rhythm**: All spacing is based on an 8px (2-unit) base increment. 
- **Reflow**: On mobile, horizontal padding shifts to `gutter-mobile` (16px), and the `-mt-8` negative margin is used to pull the hero section flush against the top navigation bar for a seamless "App-like" feel.

## Elevation & Depth

This system uses **Tonal Layering** and **Low-Contrast Outlines** rather than aggressive shadows to define hierarchy.

- **Surface 0**: The primary background (`neutral_color_hex`).
- **Surface 1**: Card containers and data tables use a white background with a 1px border in `surface-border`.
- **Level 1 Elevation**: A subtle, highly-diffused shadow (Blur: 12px, Y: 4px, Opacity: 4%) is applied only to interactive elements like the Search Bar and Hovered Cards to indicate "Lift."
- **Full Bleed**: The Hero section uses a dark tonal shift (Primary Blue) to create a distinct psychological "Start" to the user journey.

## Shapes

A "Rounded" shape language is applied (8px base) to soften the professional tone and make the repository feel approachable.

- **Standard (8px)**: Applied to input fields, buttons, and cards.
- **Large (16px)**: Applied to the Hero search container.
- **Pill**: Reserved strictly for Status Chips and Category Tags to distinguish them from interactive buttons.

## Components

### Search Bar
The primary entry point. It should be oversized with an internal height of 56px, utilizing `elevation-level-1` and a 16px corner radius. The placeholder text should be in `text-secondary`.

### Statistical Cards
Used in the `StatisticsSection`. These feature `stats-number` in Primary Navy, with labels in `label-sm` Secondary Slate. They are borderless, sitting on a `accent-soft` background.

### Research Tables
Clean, minimalist rows with `1px` bottom borders. Header cells use `label-sm` with a light gray background. Row hover states should use `accent-soft` for clear tracking.

### Category Chips
Interactive tags with a `rounded-full` radius. Use a light tint of the primary color for the background and dark primary for the text to ensure high contrast.

### Buttons
- **Primary**: Solid Navy, white text, 8px radius.
- **Secondary**: Ghost style with 1px `surface-border` and Navy text.