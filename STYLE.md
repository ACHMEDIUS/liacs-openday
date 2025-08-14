# StudentDev Branding Guide

Shared principles for building experiences under the StudentDev umbrella. Use this as a reference when styling new applications or marketing pages.

## Palette & Surfaces

- **Core gradient**: dark slate (`#0f172a`) into rich violet (`#4c1d95` → `#6b21a8`) and back to slate. Apply to top-level backgrounds, ideally with a radial emphasis from the hero focal point.
- **Accent gradients**:
  - Primary CTA: emerald (`#34d399` → `#10b981`) blending into science blue (`#3b82f6`).
  - Supporting highlight: lavender (`#c084fc`) or magenta (`#a855f7`) overlays with low opacity.
- **Typography colors**: body text in off-white (`#f8fafc`, `#e2e8f0`), secondary copy in `#94a3b8`.
- **Borders & separators**: subtle slate (`rgba(71, 85, 105, 0.6)`).

## Typography

- **Primary typeface**: Domine variable; use for headings and body to keep the serif-forward character.
- **Secondary/monospace**: Geist Mono when code or technical data is needed.
- **Logo type**: Bitcount Props Single with SquareTerminal icon for brand lockups.
- **Hierarchy**:
  - Hero headline: `text-4xl` on mobile, up to `text-6xl` max on desktop.
  - Section headers: `text-3xl` → `text-5xl`.
  - Body: `text-base` → `text-xl`, always with comfortable line-height.

## Hero Pattern

- **Background layering**:
  1. Base gradient (slate to violet).
  2. Radial purple glow centered near the hero content.
  3. Light grid overlay (140px spacing) masked with radial fade.
  4. Optional radial highlights in lavender for depth.
- **Layout**: Single-stack column centered; badge, headline, supporting text, interactive media (e.g., QR code), then CTA.
- **Badge**: Capsule shape (`rounded-full`), subtle border, translucent background, uppercase tracking.
- **CTA**: Single prominent gradient button; no pulse animation required—simple hover scale and shadow lift.
- **Media**: If using QR or imagery, keep edges clean (no drop shadows), on transparent backgrounds.

## Navigation & Footer

- Dark glass surface (`bg-slate-950/95`), with mild blur and slate border.
- Logo icon in emerald, text in white; hover states lighten text rather than change color drastically.
- Mobile menus use the same dark tone with gradient accent only inside the sheet body.
- Footer mirrors navbar surface, with accent link color in emerald.

## Components & Motion

- Cards: rounded 24px corners, dual-tone backgrounds (slate layers or light gradient). Hover shift `hover:-translate-y-1` with soft shadow.
- Buttons: prefer gradient fill for primary, translucent outlined alternatives when needed.
- Animations: gentle hover scale, grid/gradient parallax; avoid constant motion unless context-specific.

## Grid & Spacing

- Content max width: `max-w-6xl`.
- Section spacing: `py-24` desktop, `py-16` mobile.
- Maintain generous breathing room around hero elements; align CTAs and key media centrally on small screens and allow offset layout on large screens if needed.

## Tone & Voice

- Professional but inviting; copy leans toward aspirational language about growth, projects, and community.
- Ensure accessibility: maintain sufficient contrast (WCAG AA minimum), provide focus states, and keep interactive targets at least 44px tall on mobile.

Use this guide as a baseline—adapt individual pages while keeping the gradient-first, dark-theme identity intact.\*\*\* End Patch
