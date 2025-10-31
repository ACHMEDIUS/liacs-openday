# LIACS Open Day Portal

> Interactive Next.js 15 portal for Leiden University's LIACS Open Day, featuring hands-on CS demos, live Q&A board, and Firebase-backed admin tooling.

## Project Overview

This is an open day portal built for LIACS (Leiden Institute of Advanced Computer Science) featuring:

- Public-facing interactive computer science demos (sorting algorithms, maze generation, pattern recognition, object detection)
- Live Q&A board for visitor questions with admin moderation
- Interactive programming quiz system
- Spinning wheel demonstration
- Admin dashboard for content management
- Multi-language support (i18n)
- Firebase authentication and Firestore database integration

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components, Radix UI primitives
- **Backend**: Firebase (Firestore, Auth, Cloud Functions, Hosting)
- **Testing**: Vitest with Testing Library and jsdom
- **Fonts**: Domine (serif), Geist Mono (monospace), Bitcount Props Single
- **Animations**: Three.js for 3D demos, canvas-confetti, react-confetti
- **Design**: Dark gradient theme with purple/slate backgrounds, emerald/blue accents

## Key Documentation

- [README.md](README.md): Getting started guide and project basics
- [STYLE.md](STYLE.md): Design system and UI component guidelines based on current implementation

## Application Structure

### Routes (`app/`)

- `/` - Home page with QR code and branding
- `/questions` - Public Q&A board with real-time Firebase sync
- `/interactive` - Programming quiz game
- `/admin` - Protected admin dashboard for question moderation
- `/login` & `/logout` - Authentication flows
- `/wheel` - Interactive spinning wheel demo
- `/sorting` - Sorting algorithm visualization
- `/mazes` - Maze generation demonstration
- `/patterns` - Pattern recognition demo
- `/object-detection` - Object detection demonstration
- `/presentation` - Presentation mode

### Components (`components/`)

- `app/` - App-specific components (admin panels, question dialogs)
- `common/` - Reusable components (QR codes, backgrounds, mobile notices)
- `core/` - Core layout components (header, footer, navigation)
- `ui/` - shadcn/ui primitives (buttons, cards, dialogs, forms)

### Libraries & Utilities (`lib/`)

- `firebase.ts` - Firebase client SDK initialization
- `i18n/` - Internationalization context and translations
- `data/` - Seed data for programming questions and content
- `hooks/` - Custom React hooks (use-mobile, use-toast)

### Cloud Functions (`functions/`)

Server-side Firebase Cloud Functions for backend operations. Run `npm install` in `functions/` before deploying.

## Development Workflow

### Setup

```bash
npm install
npm run dev  # Start dev server on http://localhost:3000
```

### Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format with Prettier
- `npm test` - Run Vitest tests
- `npm run test:coverage` - Test with coverage report
- `npm run type-check` - TypeScript type checking

### Code Quality

- **Linting**: ESLint with Next.js config and Prettier integration
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Safety**: Strict TypeScript enabled
- **Testing**: Vitest with @testing-library/react
- **Git Hooks**: Husky pre-commit hooks for quality checks

## Firebase Deployment

- Hosting config: `firebase.json`
- App Hosting: `apphosting.yaml` for Cloud Run deployment
- Functions: Deploy from `functions/src/index.ts`

## Design System

The app uses a consistent dark gradient theme:

- Background: Slate-950 to purple-950 gradients with radial purple glows
- Accents: Emerald green (`#10b981`) and science blue (`#3b82f6`)
- Typography: Domine serif for body text, off-white text colors
- Components: Cards with subtle borders, rounded corners, muted backgrounds
- CTAs: Gradient buttons (emerald to blue) with hover animations

See [STYLE.md](STYLE.md) for complete design guidelines.

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind theme with custom colors (leiden, science)
- `tsconfig.json` - TypeScript compiler options with path aliases
- `vitest.config.ts` - Test runner configuration
- `package.json` - Dependencies and scripts
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting rules
