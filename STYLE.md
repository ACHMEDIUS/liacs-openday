# LIACS Open Day Portal - Design Guide

Design system and component guidelines for the LIACS Open Day Portal. This guide documents the visual patterns used across public routes and provides standards for consistent styling.

## Color System

### Brand Colors

- **Leiden Green**: `#10b981` (emerald-500) - Primary accent for LIACS branding
- **Science Blue**: `#3b82f6` (blue-500) - Secondary accent for technical emphasis
- **Purple Tones**: Used in gradients for depth and visual interest
  - `#4c1d95` (purple-950)
  - `#6b21a8` (purple-800)
  - `#a855f7` (purple-500)
  - `#c084fc` (purple-400)

### Background Colors

- **Dark Slate**: `#0f172a` (slate-950) - Base background color
- **Gradient Pattern**: Vertical gradient from slate-950 through purple-950 back to slate-950
- **Radial Overlays**: Purple radial gradients (85-95% opacity) for depth

### Text Colors

- **Primary Text**: `#f8fafc` (slate-50) - White text on dark backgrounds
- **Secondary Text**: `#e2e8f0` (slate-200) - Slightly muted white
- **Muted Text**: `#94a3b8` (slate-400) - De-emphasized copy
- **Colored Text**: Use `text-leiden` for emerald accents in headings

### Borders & Dividers

- **Default**: `border-border/40` or `border-white/15` - Subtle, semi-transparent
- **Card Borders**: `border-leiden/30` for accent cards
- **Inputs**: `border-border` - Standard input borders

## Typography

### Font Families

```css
--font-domine: 'Domine', serif; /* Primary font for UI */
--font-geist-mono: 'Geist Mono', monospace; /* Code and technical text */
--font-bitcount: 'Bitcount Props Single', monospace; /* Logo/branding */
```

### Type Scale

- **Hero Headline**: `text-4xl font-bold` (mobile) → larger on desktop
- **Page Title**: `text-4xl font-bold text-leiden` or `text-white`
- **Section Header**: `text-2xl font-semibold`
- **Card Title**: `text-lg` or `text-2xl` depending on hierarchy
- **Body Text**: `text-base` → `text-xl` with `font-domine`
- **Small Text**: `text-sm text-muted-foreground`
- **Micro Copy**: `text-xs font-medium uppercase tracking-wide`

### Text Styling Patterns

- Use `drop-shadow-2xl` or `drop-shadow-xl` on light text over dark gradients
- Apply `tracking-[0.3em]` for uppercase badge text
- Maintain `leading-[1.2]` for tight headline spacing

## Layout Patterns

### Page Layout

```jsx
<div className="relative min-h-screen overflow-hidden">
  {/* Background gradient component */}
  <SimpleGradientBackground />

  {/* Main content */}
  <main className="relative z-10 ...">{/* Content here */}</main>

  {/* Footer */}
  <div className="fixed bottom-0 left-0 right-0 z-20">
    <Footer />
  </div>
</div>
```

### Container Widths

- **Max Width**: `max-w-3xl` (hero), `max-w-5xl` (content), `max-w-6xl` (wide)
- **Centering**: `mx-auto` with `px-4` or `px-6` for side padding
- **Vertical Spacing**: `py-12` or `py-16`

### Hero Section Pattern

Used on home page and landing pages:

```jsx
<section className="max-w-3xl text-center">
  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
    Badge Text
  </span>
  <h1 className="mb-2 max-w-[600px] font-domine text-4xl font-bold leading-[1.2] text-white drop-shadow-2xl">
    Main Heading
  </h1>
  <p className="mb-8 max-w-xl font-domine text-white drop-shadow-xl">Supporting text</p>
  {/* CTA or interactive element */}
</section>
```

## Background System

### Gradient Background Component

The `SimpleGradientBackground` component creates the signature dark gradient:

**Layer Structure:**

1. Base vertical gradient (slate-950 → purple-950 → slate-950)
2. Radial purple overlay centered at top (85-95% opacity)
3. Grid pattern (140px spacing) with radial mask fade
4. Additional radial purple accents for depth (30-60% opacity)

**Usage:**

```jsx
import SimpleGradientBackground from '@/components/common/HeroBackground';

<div className="relative min-h-screen">
  <SimpleGradientBackground />
  <main className="relative z-10">{/* Content */}</main>
</div>;
```

## Components

### Cards

Standard card styling from shadcn/ui with project-specific patterns:

**Default Card:**

```jsx
<Card className="border-border/40 bg-muted/20">
  <CardContent className="space-y-3 p-5">{/* Card content */}</CardContent>
</Card>
```

**Accent Card (Leiden Green):**

```jsx
<Card className="border-leiden/30">
  <CardHeader>
    <CardTitle className="text-2xl">Title</CardTitle>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

**Rounded Corners:** Default is `rounded-lg`, cards typically use standard radius

### Buttons

**Primary CTA (Gradient):**

```jsx
<Link className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 px-8 py-3 font-semibold text-white shadow-[0px_25px_65px_-30px_rgba(56,189,248,0.6)] transition duration-300 hover:scale-105 hover:shadow-[0px_35px_85px_-35px_rgba(56,189,248,0.7)]">
  Button Text
  <Icon className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
</Link>
```

**Standard Button:**
Use shadcn/ui Button component with variants:

- Default: standard button style
- Outline: for secondary actions
- Ghost: for tertiary actions

### Badges

```jsx
<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
  Badge Text
</span>
```

### Loading States

```jsx
<Loader2 className="h-8 w-8 animate-spin text-leiden" aria-label="Loading..." />
```

### Separators

Use shadcn/ui Separator component:

```jsx
<Separator /> {/* Horizontal by default */}
```

## Interactive Elements

### QR Codes

Clean, rounded style on transparent backgrounds:

```jsx
<QRCode
  data={url}
  width={240}
  height={240}
  dotsOptions={{ color: '#f8fafc', type: 'rounded' }}
  backgroundOptions={{ color: 'transparent' }}
  cornersSquareOptions={{ color: '#f8fafc', type: 'extra-rounded' }}
  cornersDotOptions={{ color: '#f8fafc', type: 'dot' }}
/>
```

### Icons

Use Lucide React icons throughout:

- Size: `h-5 w-5` (standard), `h-8 w-8` (large)
- Color: Inherit from parent text color or use `text-leiden`
- Animations: `transition-transform` for hover effects

## Animations

### Hover Effects

- **Cards**: `hover:-translate-y-1` with shadow transition
- **Buttons**: `hover:scale-105` with shadow enhancement
- **Icons**: Subtle directional transforms on parent hover

### Loading & Transitions

- Use `transition duration-300` for smooth transitions
- Loading spinners: `animate-spin` utility
- Entrance animations: Keep subtle, avoid excessive motion

### Custom Animations

Defined in `globals.css`:

- `breathingGlow` - Pulsing glow effect
- `breathingRipple` - Expanding ripple effect
- `breathingBorder` - Pulsing border glow
- `breathingGlowBorder` - Combined glow and border pulse

## Spacing & Layout

### Section Spacing

- **Vertical**: `py-12` (standard), `py-16` (larger sections), `py-20` (hero)
- **Horizontal**: `px-4` (mobile), `px-6` (tablet+)
- **Container**: `max-w-5xl mx-auto` (standard content width)

### Component Spacing

- **Stack**: `space-y-4` (default), `space-y-8` (sections), `space-y-10` (major sections)
- **Gap**: `gap-2` (tight), `gap-4` (standard), `gap-8` (loose)
- **Margins**: Use `mb-2`, `mb-4`, `mb-8` for progressive spacing

### Grid Layouts

```jsx
<div className="grid gap-4">{/* Cards or items */}</div>
```

## Accessibility

### Contrast

- Maintain WCAG AA minimum contrast ratios
- Light text (`#f8fafc`) on dark backgrounds provides excellent contrast
- Use `text-muted-foreground` sparingly where reduced contrast is acceptable

### Focus States

- Ensure all interactive elements have visible focus indicators
- Use `ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`

### Interactive Targets

- Minimum 44x44px touch targets on mobile
- Ensure buttons and links have adequate padding

### ARIA Labels

- Add `aria-label` to icon-only buttons and loading states
- Use semantic HTML elements where possible

## Responsive Design

### Breakpoints (Tailwind defaults)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile Patterns

- Stack layouts vertically on mobile
- Reduce text sizes: `text-4xl` → `text-3xl` on mobile
- Adjust padding: `py-24` → `py-16` on smaller screens
- Use `MobileUnsupportedNotice` component for features requiring desktop

## Theme Support

The app includes dark mode support via `next-themes`. Color variables are defined in `globals.css` with automatic dark mode variants.

**Using Theme Colors:**

```jsx
className = 'bg-background text-foreground';
className = 'border-border';
className = 'bg-card text-card-foreground';
```

## Best Practices

1. **Consistency**: Use the defined color palette and spacing scale consistently
2. **Hierarchy**: Maintain clear visual hierarchy with size, weight, and color
3. **Whitespace**: Don't be afraid of generous spacing—it improves readability
4. **Gradients**: Use sparingly for backgrounds and primary CTAs
5. **Performance**: Optimize images, use `next/font` for web fonts
6. **Components**: Leverage shadcn/ui components for consistency
7. **Accessibility**: Always test with keyboard navigation and screen readers
